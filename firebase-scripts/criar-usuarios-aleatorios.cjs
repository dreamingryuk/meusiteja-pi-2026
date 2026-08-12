/**
 * Script: criar-usuarios-aleatorios.cjs
 * -------------------------------------------------
 * Cria N usuários "reais" no Firebase Authentication + Firestore,
 * cada um com: nome, foto de perfil (real ou estilo anime), título,
 * descrição, bio, experiência profissional, formação, habilidades,
 * contato e paleta de cores — tudo preenchido automaticamente,
 * imitando alguém que passou pelo formulário do site.
 *
 * FONTES DE FOTO/NOME (gratuitas, sem chave de API):
 *  - Fotos "reais": https://randomuser.me  (também fornece nome)
 *  - Fotos estilo anime/cartoon: https://dicebear.com (gera avatar por seed)
 *
 * NÃO usa nenhuma IA generativa de texto por padrão (evita estourar
 * limite de requisições). As bios/descrições são montadas combinando
 * frases prontas em português. Se quiser usar IA para "melhorar" os
 * textos, veja a seção OPCIONAL: MELHORAR TEXTOS COM IA no final do
 * arquivo — ela já vem com um delay entre chamadas para não sobrecarregar.
 *
 * COMO USAR:
 * 1. Dentro da pasta firebase-scripts: npm init -y && npm install firebase-admin
 *    (requer Node 18+ por causa do fetch nativo)
 * 2. Coloque a chave do Admin SDK como "serviceAccountKey.json" nesta pasta
 * 3. Ajuste TIPO_FOTO abaixo ('real' ou 'anime') se quiser
 * 4. Rode: node criar-usuarios-aleatorios.cjs
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth();
const db = getFirestore();

// ==================== CONFIGURAÇÃO ====================
const QUANTIDADE = 11;
const TIPO_FOTO = 'real'; // 'real' (randomuser.me) ou 'anime' (dicebear)
const DELAY_ENTRE_USUARIOS_MS = 400; // evita rajada de requisições
// ========================================================

// ---------- Bancos de dados para montar os perfis ----------

const titulos = [
  'Desenvolvedor(a) Full Stack', 'Designer de Produto', 'Analista de Marketing Digital',
  'Engenheiro(a) de Software', 'Fotógrafo(a) Profissional', 'Consultor(a) Jurídico',
  'Personal Trainer', 'Nutricionista', 'Arquiteto(a)', 'Redator(a) Publicitário(a)',
  'Especialista em UX/UI', 'Gestor(a) de Projetos', 'Cientista de Dados',
  'Terapeuta Holístico(a)', 'Empreendedor(a) Digital'
];

const descricoesCurtas = [
  'Transformo ideias em soluções digitais que fazem diferença.',
  'Apaixonado(a) por criar experiências que conectam pessoas e marcas.',
  'Ajudo empresas a crescerem com estratégias criativas e baseadas em dados.',
  'Focado(a) em entregar resultados com qualidade e atenção aos detalhes.',
  'Combino técnica e criatividade para resolver problemas complexos.',
  'Trabalho todos os dias para tornar processos mais simples e eficientes.',
  'Busco sempre aprender algo novo e aplicar na prática do meu trabalho.',
  'Acredito que bons resultados vêm de um bom planejamento e dedicação.'
];

const biosSobre = [
  'Sou uma pessoa curiosa e que gosta de aprender coisas novas todos os dias. Ao longo da minha trajetória, busquei unir teoria e prática para entregar sempre o meu melhor.',
  'Comecei minha carreira ainda na faculdade e desde então venho me especializando cada vez mais na área. Gosto de trabalhar em equipe e de compartilhar conhecimento.',
  'Sou movido(a) por desafios e por projetos que causam impacto real na vida das pessoas. Fora do trabalho, gosto de ler, viajar e conhecer novas culturas.',
  'Minha jornada profissional é marcada pela vontade constante de evoluir. Acredito que dedicação e consistência são a base de qualquer bom resultado.',
  'Sempre fui apaixonado(a) pelo que faço. Gosto de entender profundamente cada problema antes de propor uma solução, e isso reflete na qualidade do meu trabalho.',
  'Ao longo dos anos, desenvolvi um olhar atento para detalhes que fazem diferença. Gosto de conversar, trocar ideias e crescer junto com quem trabalho.'
];

const empresas = [
  'Nexa Tecnologia', 'Grupo Horizonte', 'Studio Criativo', 'InovaTech Soluções',
  'Vértice Consultoria', 'Bright Digital', 'Prisma Marketing', 'Cora Saúde',
  'Alfa Engenharia', 'Zenith Advogados', 'Lumen Design', 'Norte Educação'
];

const cargos = [
  'Estagiário(a)', 'Assistente', 'Analista Jr.', 'Analista Pleno', 'Analista Sênior',
  'Coordenador(a)', 'Especialista', 'Consultor(a)', 'Líder de Equipe', 'Gerente'
];

const descricoesExperiencia = [
  'Responsável por planejar e executar projetos, garantindo prazos e qualidade.',
  'Atuei diretamente com clientes, entendendo necessidades e propondo soluções.',
  'Desenvolvi processos internos que aumentaram a eficiência da equipe.',
  'Trabalhei em conjunto com outras áreas para entregar resultados consistentes.',
  'Liderei iniciativas que contribuíram para o crescimento do setor.',
  'Apoiei a equipe em tarefas estratégicas e operacionais do dia a dia.'
];

const instituicoes = [
  'Universidade Federal de Santa Catarina', 'PUC-SP', 'Universidade de São Paulo',
  'UNICAMP', 'Universidade Federal do Paraná', 'Mackenzie', 'UFMG', 'UFRGS',
  'Estácio', 'Anhembi Morumbi'
];

const cursos = [
  'Ciência da Computação', 'Design Gráfico', 'Administração', 'Marketing',
  'Engenharia Civil', 'Direito', 'Publicidade e Propaganda', 'Sistemas de Informação',
  'Nutrição', 'Arquitetura e Urbanismo'
];

const habilidadesTecnicas = [
  'JavaScript, React, Node.js, Git', 'Figma, Adobe XD, Photoshop, Illustrator',
  'Excel avançado, Power BI, SQL', 'Google Ads, Meta Ads, SEO, Analytics',
  'Python, Machine Learning, Pandas', 'AutoCAD, SketchUp, Revit',
  'Gestão de projetos, Scrum, Kanban', 'Redação, Copywriting, Storytelling'
];

const habilidadesPessoais = [
  'Comunicação, trabalho em equipe, proatividade',
  'Organização, liderança, resolução de problemas',
  'Criatividade, empatia, adaptabilidade',
  'Pensamento crítico, foco em resultados, colaboração',
  'Paciência, escuta ativa, negociação'
];

const paletasDeCores = [
  { cor_primaria: '#2563EB', cor_secundaria: '#1E293B' },
  { cor_primaria: '#DC2626', cor_secundaria: '#111827' },
  { cor_primaria: '#059669', cor_secundaria: '#064E3B' },
  { cor_primaria: '#7C3AED', cor_secundaria: '#312E81' },
  { cor_primaria: '#EA580C', cor_secundaria: '#7C2D12' },
  { cor_primaria: '#DB2777', cor_secundaria: '#831843' },
  { cor_primaria: '#0891B2', cor_secundaria: '#164E63' }
];

const templates = ['tech', 'saude', 'academico', 'criativo', 'juridico', 'executivo', 'beleza', 'jovem', 'minimalista'];

const nomesFallback = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Fabio', 'Giovana', 'Hugo', 'Igor', 'Julia', 'Karin', 'Lucas', 'Marina', 'Nicolas', 'Olivia'];
const sobrenomesFallback = ['Silva', 'Souza', 'Oliveira', 'Costa', 'Pereira', 'Lima', 'Carvalho', 'Ferreira', 'Rocha', 'Almeida'];

// ---------- Funções utilitárias ----------

function aleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function embaralharSubset(lista, min, max) {
  const copia = [...lista].sort(() => Math.random() - 0.5);
  const qtd = Math.floor(Math.random() * (max - min + 1)) + min;
  return copia.slice(0, qtd);
}

function gerarSenha() {
  return Math.random().toString(36).slice(-8) + 'A1!';
}

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function gerarTelefone() {
  const ddd = 40 + Math.floor(Math.random() * 50);
  const numero = Math.floor(90000000 + Math.random() * 9999999);
  return `(${ddd}) 9${numero}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Busca nome + foto real de uma pessoa (randomuser.me)
async function buscarPessoaReal() {
  try {
    const resp = await fetch('https://randomuser.me/api/?nat=br&inc=name,picture');
    const json = await resp.json();
    const pessoa = json.results[0];
    const nome = pessoa.name.first;
    const sobrenome = pessoa.name.last;
    return { nome, sobrenome, foto: pessoa.picture.large };
  } catch (err) {
    console.warn('  ⚠ Falha ao buscar dados em randomuser.me, usando fallback local.', err.message);
    return null;
  }
}

// Gera avatar estilo anime/cartoon (dicebear) a partir de uma seed
function gerarFotoAnime(seed) {
  // "adventurer" tem um visual estilizado tipo anime/cartoon
  return `https://api.dicebear.com/7.x/adventurer/png?seed=${encodeURIComponent(seed)}&size=400`;
}

async function montarPessoa(indice) {
  let nome, sobrenome, foto;

  if (TIPO_FOTO === 'real') {
    const real = await buscarPessoaReal();
    if (real) {
      ({ nome, sobrenome, foto } = real);
    }
  }

  // Fallback (ou modo 'anime'): nome local + avatar gerado
  if (!nome) {
    nome = aleatorio(nomesFallback);
    sobrenome = aleatorio(sobrenomesFallback);
  }
  if (!foto) {
    foto = gerarFotoAnime(`${nome}${sobrenome}${indice}`);
  }

  return { nome, sobrenome, foto };
}

function montarExperiencias() {
  const quantidade = 1 + Math.floor(Math.random() * 3); // 1 a 3
  const usadas = new Set();
  const lista = [];
  for (let i = 0; i < quantidade; i++) {
    let empresa;
    do { empresa = aleatorio(empresas); } while (usadas.has(empresa) && usadas.size < empresas.length);
    usadas.add(empresa);
    lista.push({
      empresa,
      cargo: aleatorio(cargos),
      descricao: aleatorio(descricoesExperiencia)
    });
  }
  return lista;
}

function montarEducacoes() {
  const quantidade = 1 + Math.floor(Math.random() * 2); // 1 a 2
  const anoBase = 2010 + Math.floor(Math.random() * 12);
  const lista = [];
  for (let i = 0; i < quantidade; i++) {
    lista.push({
      instituicao: aleatorio(instituicoes),
      curso: aleatorio(cursos),
      ano: String(anoBase + i * 2)
    });
  }
  return lista;
}

async function criarUsuarios() {
  console.log(`Criando ${QUANTIDADE} usuários com perfis realistas (foto: ${TIPO_FOTO})...\n`);

  for (let i = 0; i < QUANTIDADE; i++) {
    try {
      const { nome, sobrenome, foto } = await montarPessoa(i);
      const nomeCompleto = `${nome} ${sobrenome}`;
      const emailLocal = `${normalizar(nome)}.${normalizar(sobrenome)}${Date.now().toString().slice(-5)}${i}`;
      const email = `${emailLocal}@teste.com`;
      const senha = gerarSenha();
      const paleta = aleatorio(paletasDeCores);

      // 1. Cria o usuário no Firebase Authentication
      const userRecord = await auth.createUser({
        email,
        password: senha,
        displayName: nomeCompleto,
        photoURL: foto,
      });

      // 2. Monta o "site" completo, no mesmo formato que o formulário gera
      const siteData = {
        uid: userRecord.uid,
        nome: nomeCompleto,
        titulo: aleatorio(titulos),
        descricao: aleatorio(descricoesCurtas),
        sobre: aleatorio(biosSobre),
        experiencias: montarExperiencias(),
        educacoes: montarEducacoes(),
        tecnicas: aleatorio(habilidadesTecnicas),
        pessoais: aleatorio(habilidadesPessoais),
        email,
        telefone: gerarTelefone(),
        instagram: `@${emailLocal}`,
        linkedin: `linkedin.com/in/${emailLocal}`,
        foto,
        cor_primaria: paleta.cor_primaria,
        cor_secundaria: paleta.cor_secundaria,
        template: aleatorio(templates),
        subdominio: `${emailLocal}`.slice(0, 30),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.collection('sites').doc(userRecord.uid).set(siteData);

      console.log(`✔ [${i + 1}/${QUANTIDADE}] ${nomeCompleto} — ${email} — senha: ${senha}`);
    } catch (err) {
      console.error(`✘ Erro ao criar usuário ${i + 1}:`, err.message);
    }

    await sleep(DELAY_ENTRE_USUARIOS_MS);
  }

  console.log('\nConcluído! Guarde a lista de emails/senhas acima se precisar logar depois.');
  process.exit(0);
}

criarUsuarios();

/*
=====================================================================
OPCIONAL: MELHORAR TEXTOS COM IA (groqService, do seu próprio projeto)
=====================================================================
Por padrão o script NÃO usa IA para gerar/melhorar os textos, porque
para 11 usuários x vários campos de texto isso seria muitas chamadas
em pouco tempo e pode esbarrar em limite de taxa da API gratuita.

Se ainda assim quiser usar (ex: para deixar as bios mais "únicas"),
dá pra chamar a mesma função que o app usa (src/services/groqService.js),
mas SEMPRE com um delay generoso entre chamadas. Exemplo:

  // Dentro do loop, antes do db.collection('sites')...set(siteData):
  // (requer copiar/importar a lógica de improveText para este script,
  // ou expor um endpoint próprio que o script possa chamar)
  siteData.sobre = await improveText(siteData.sobre, 'apresentação pessoal');
  await sleep(2000); // espera 2s entre cada chamada de IA

Use com moderação — para 11 usuários, ligar isso para 2-3 campos já
significa 20-30 chamadas seguidas à API.
*/

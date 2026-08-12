/**
 * Script: importar-json-firestore.js
 * -------------------------------------------------
 * Importa um arquivo JSON (array de objetos) para uma coleção do Firestore.
 * O Firestore não tem "importar JSON" direto no Console — este script
 * lê o arquivo e grava cada item como um documento, usando lotes (batch)
 * para não estourar limites da API.
 *
 * COMO USAR:
 * 1. npm install firebase-admin
 * 2. Coloque "serviceAccountKey.json" (chave do Admin SDK) nesta pasta
 * 3. Coloque seu arquivo de dados como "dados.json" nesta pasta.
 *    Formato esperado (array de objetos), exemplo no schema deste projeto:
 *    [
 *      {
 *        "id": "opcional-uid-1",
 *        "nome": "Ana Silva",
 *        "titulo": "Designer de Produto",
 *        "descricao": "Transformo ideias em soluções digitais.",
 *        "sobre": "Texto de apresentação pessoal...",
 *        "experiencias": [ { "empresa": "Nexa Tecnologia", "cargo": "Analista", "descricao": "..." } ],
 *        "educacoes": [ { "instituicao": "USP", "curso": "Design", "ano": "2018" } ],
 *        "tecnicas": "Figma, Photoshop",
 *        "pessoais": "Comunicação, organização",
 *        "email": "ana@teste.com",
 *        "telefone": "(48) 999999999",
 *        "instagram": "@anasilva",
 *        "linkedin": "linkedin.com/in/anasilva",
 *        "foto": "https://exemplo.com/foto.jpg",
 *        "cor_primaria": "#2563EB",
 *        "cor_secundaria": "#1E293B",
 *        "template": "tech",
 *        "subdominio": "anasilva"
 *      }
 *    ]
 *    - Se o objeto tiver um campo "id", ele vira o ID do documento (recomendado
 *      usar o mesmo UID do usuário no Auth, para bater com a coleção "sites").
 *    - Se não tiver, o Firestore gera um ID automático.
 * 4. Ajuste a constante COLECAO abaixo (ex: "sites")
 * 5. Rode: node importar-json-firestore.cjs
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const COLECAO = 'sites';       // nome da coleção destino
const ARQUIVO_JSON = './dados.json';
const TAMANHO_LOTE = 400;      // Firestore permite até 500 operações por batch

async function importar() {
  const raw = fs.readFileSync(ARQUIVO_JSON, 'utf-8');
  const itens = JSON.parse(raw);

  if (!Array.isArray(itens)) {
    console.error('O JSON precisa ser um array de objetos: [ {...}, {...} ]');
    process.exit(1);
  }

  console.log(`Importando ${itens.length} itens para a coleção "${COLECAO}"...\n`);

  let batch = db.batch();
  let contador = 0;
  let totalImportado = 0;

  for (const item of itens) {
    const { id, ...dados } = item;
    const ref = id ? db.collection(COLECAO).doc(id) : db.collection(COLECAO).doc();

    batch.set(ref, dados);
    contador++;
    totalImportado++;

    if (contador === TAMANHO_LOTE) {
      await batch.commit();
      console.log(`  → ${totalImportado} documentos gravados até agora...`);
      batch = db.batch();
      contador = 0;
    }
  }

  if (contador > 0) {
    await batch.commit();
  }

  console.log(`\nConcluído! ${totalImportado} documentos importados para "${COLECAO}".`);
  process.exit(0);
}

importar().catch((err) => {
  console.error('Erro na importação:', err);
  process.exit(1);
});

import React from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SkillBadge({ skill, bg, text }) {
  return (
    <span className={`px-3 py-1 ${bg} ${text} rounded-full text-sm font-medium capitalize`}>
      {skill.trim()}
    </span>
  );
}

function parseSkills(str) {
  if (!str) return [];
  return str.split(',').map(s => s.trim()).filter(Boolean);
}

// ─── TEMPLATE: TECH ───────────────────────────────────────────────────────────
function TemplateTech({ data }) {
  const primary = data.cor_primaria || '#2563EB';
  const secondary = data.cor_secundaria || '#1D4ED8';
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} className="px-8 py-14 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white/20 shadow-2xl overflow-hidden flex-shrink-0">
          {data.foto
            ? <img src={data.foto} alt="Foto" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gray-800 flex items-center justify-center text-5xl">💻</div>}
        </div>
        <div>
          <p className="text-white/60 text-sm mb-1 tracking-widest uppercase">{'<developer>'}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white capitalize">{data.nome || 'Seu Nome'}</h1>
          <p className="text-xl text-white/80 mt-1 capitalize">{data.titulo || 'Profissional'}</p>
          {data.descricao && <p className="text-white/60 mt-2 text-sm">{data.descricao}</p>}
          <p className="text-white/40 text-xs mt-3 tracking-widest">{'</developer>'}</p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Sobre */}
        {data.sobre && (
          <section>
            <h2 className="text-xs tracking-widest uppercase mb-3" style={{ color: primary }}>// sobre_mim</h2>
            <p className="text-gray-300 leading-relaxed border-l-2 pl-4" style={{ borderColor: primary }}>{data.sobre}</p>
          </section>
        )}

        {/* Experiência */}
        {data.experiencias?.length > 0 && (
          <section>
            <h2 className="text-xs tracking-widest uppercase mb-3" style={{ color: primary }}>// experiência</h2>
            <div className="space-y-4">
              {data.experiencias.map((exp, i) => (
                <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <p className="font-bold text-white capitalize">{exp.empresa}</p>
                  <p style={{ color: primary }} className="text-sm capitalize">{exp.cargo}</p>
                  {exp.descricao && <p className="text-gray-400 text-sm mt-1">{exp.descricao}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formação */}
        {data.educacoes?.length > 0 && (
          <section>
            <h2 className="text-xs tracking-widest uppercase mb-3" style={{ color: primary }}>// formação</h2>
            <div className="space-y-3">
              {data.educacoes.map((edu, i) => (
                <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <p className="font-bold text-white capitalize">{edu.instituicao}</p>
                  <p className="text-gray-400 text-sm capitalize">{edu.curso} {edu.ano && `· ${edu.ano}`}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Habilidades */}
        {(data.tecnicas || data.pessoais) && (
          <section>
            <h2 className="text-xs tracking-widest uppercase mb-3" style={{ color: primary }}>// habilidades</h2>
            <div className="flex flex-wrap gap-2">
              {parseSkills(data.tecnicas).map((s, i) => (
                <span key={i} className="px-3 py-1 rounded text-sm font-mono border" style={{ borderColor: primary, color: primary }}>{s}</span>
              ))}
              {parseSkills(data.pessoais).map((s, i) => (
                <span key={i} className="px-3 py-1 rounded text-sm font-mono bg-gray-800 text-gray-300">{s}</span>
              ))}
            </div>
          </section>
        )}

        {/* Contato */}
        <section>
          <h2 className="text-xs tracking-widest uppercase mb-3" style={{ color: primary }}>// contato</h2>
          <div className="grid md:grid-cols-2 gap-3 text-gray-400 text-sm">
            {data.email && <p>📧 {data.email}</p>}
            {data.telefone && <p>📱 {data.telefone}</p>}
            {data.instagram && <p>📷 {data.instagram}</p>}
            {data.linkedin && <p>💼 {data.linkedin}</p>}
          </div>
          {data.subdominio && <p className="mt-3 text-xs text-gray-600">🔗 {data.subdominio}.meusiteja.com</p>}
        </section>
      </div>
    </div>
  );
}

// ─── TEMPLATE: MINIMALISTA ────────────────────────────────────────────────────
function TemplateMinimalista({ data }) {
  return (
    <div className="min-h-screen bg-white text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="border-b border-gray-200 px-10 py-16 text-center">
        <div className="w-28 h-28 rounded-full mx-auto overflow-hidden mb-6 border border-gray-200">
          {data.foto
            ? <img src={data.foto} alt="Foto" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl text-gray-400">👤</div>}
        </div>
        <h1 className="text-4xl font-normal text-gray-900 capitalize tracking-wide">{data.nome || 'Seu Nome'}</h1>
        <p className="text-lg text-gray-500 mt-2 capitalize tracking-widest text-sm">{data.titulo || 'Profissional'}</p>
        {data.descricao && <p className="text-gray-400 mt-3 text-sm max-w-md mx-auto">{data.descricao}</p>}
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-10 py-12 space-y-12">

        {data.sobre && (
          <section>
            <h2 className="text-xs tracking-widest uppercase text-gray-400 mb-4">Sobre</h2>
            <p className="text-gray-600 leading-8">{data.sobre}</p>
          </section>
        )}

        {data.experiencias?.length > 0 && (
          <section>
            <h2 className="text-xs tracking-widest uppercase text-gray-400 mb-4">Experiência</h2>
            <div className="space-y-6">
              {data.experiencias.map((exp, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-1 bg-gray-200 flex-shrink-0 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-800 capitalize">{exp.empresa}</p>
                    <p className="text-gray-500 text-sm capitalize italic">{exp.cargo}</p>
                    {exp.descricao && <p className="text-gray-500 text-sm mt-1">{exp.descricao}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.educacoes?.length > 0 && (
          <section>
            <h2 className="text-xs tracking-widest uppercase text-gray-400 mb-4">Formação</h2>
            <div className="space-y-4">
              {data.educacoes.map((edu, i) => (
                <div key={i}>
                  <p className="font-semibold capitalize">{edu.instituicao}</p>
                  <p className="text-gray-500 text-sm capitalize italic">{edu.curso} {edu.ano && `· ${edu.ano}`}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(data.tecnicas || data.pessoais) && (
          <section>
            <h2 className="text-xs tracking-widest uppercase text-gray-400 mb-4">Habilidades</h2>
            <div className="flex flex-wrap gap-2">
              {parseSkills(data.tecnicas).map((s, i) => (
                <span key={i} className="text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded-full capitalize">{s}</span>
              ))}
              {parseSkills(data.pessoais).map((s, i) => (
                <span key={i} className="text-sm text-gray-400 px-3 py-1 capitalize">{s}</span>
              ))}
            </div>
          </section>
        )}

        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-xs tracking-widest uppercase text-gray-400 mb-4">Contato</h2>
          <div className="grid md:grid-cols-2 gap-2 text-gray-500 text-sm">
            {data.email && <p>{data.email}</p>}
            {data.telefone && <p>{data.telefone}</p>}
            {data.instagram && <p>{data.instagram}</p>}
            {data.linkedin && <p>{data.linkedin}</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── TEMPLATE: CRIATIVO ───────────────────────────────────────────────────────
function TemplateCriativo({ data }) {
  const primary = data.cor_primaria || '#7C3AED';
  const secondary = data.cor_secundaria || '#DB2777';
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)` }} className="px-8 py-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 bg-white -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 bg-white translate-y-1/2 -translate-x-1/4" />
        <div className="relative flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
          <div className="w-36 h-36 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 flex-shrink-0 rotate-3">
            {data.foto
              ? <img src={data.foto} alt="Foto" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-white/20 flex items-center justify-center text-5xl">🎨</div>}
          </div>
          <div>
            <h1 className="text-5xl font-black capitalize leading-tight">{data.nome || 'Seu Nome'}</h1>
            <p className="text-xl font-light mt-2 capitalize text-white/90">{data.titulo || 'Criativo'}</p>
            {data.descricao && <p className="text-white/70 mt-3 text-sm max-w-lg">{data.descricao}</p>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {data.sobre && (
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-black mb-4" style={{ color: primary }}>Sobre mim ✨</h2>
            <p className="text-gray-600 leading-relaxed">{data.sobre}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {data.experiencias?.length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-black mb-4" style={{ color: secondary }}>Experiência 🚀</h2>
              <div className="space-y-4">
                {data.experiencias.map((exp, i) => (
                  <div key={i} className="border-l-4 pl-4" style={{ borderColor: secondary }}>
                    <p className="font-bold capitalize">{exp.empresa}</p>
                    <p className="text-sm text-gray-500 capitalize">{exp.cargo}</p>
                    {exp.descricao && <p className="text-xs text-gray-400 mt-1">{exp.descricao}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.educacoes?.length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-black mb-4" style={{ color: primary }}>Formação 🎓</h2>
              <div className="space-y-4">
                {data.educacoes.map((edu, i) => (
                  <div key={i} className="border-l-4 pl-4" style={{ borderColor: primary }}>
                    <p className="font-bold capitalize">{edu.instituicao}</p>
                    <p className="text-sm text-gray-500 capitalize">{edu.curso} {edu.ano && `· ${edu.ano}`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {(data.tecnicas || data.pessoais) && (
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-black mb-4" style={{ color: secondary }}>Habilidades 💡</h2>
            <div className="flex flex-wrap gap-2">
              {parseSkills(data.tecnicas).map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-sm font-semibold text-white capitalize" style={{ background: primary }}>{s}</span>
              ))}
              {parseSkills(data.pessoais).map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-sm font-semibold text-white capitalize" style={{ background: secondary }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-black mb-4" style={{ color: primary }}>Contato 📬</h2>
          <div className="grid md:grid-cols-2 gap-3 text-gray-600 text-sm">
            {data.email && <p>📧 {data.email}</p>}
            {data.telefone && <p>📱 {data.telefone}</p>}
            {data.instagram && <p>📷 {data.instagram}</p>}
            {data.linkedin && <p>💼 {data.linkedin}</p>}
          </div>
          {data.subdominio && <p className="mt-4 text-xs text-gray-400">🔗 {data.subdominio}.meusiteja.com</p>}
        </div>
      </div>
    </div>
  );
}

// ─── TEMPLATE: EXECUTIVO ──────────────────────────────────────────────────────
function TemplateExecutivo({ data }) {
  const primary = data.cor_primaria || '#1E3A5F';
  const secondary = data.cor_secundaria || '#B8860B';
  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: primary }} className="px-10 py-16">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 flex-shrink-0" style={{ borderColor: secondary }}>
            {data.foto
              ? <img src={data.foto} alt="Foto" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gray-700 flex items-center justify-center text-4xl">📊</div>}
          </div>
          <div className="text-white text-center md:text-left">
            <h1 className="text-4xl font-bold capitalize tracking-wide">{data.nome || 'Seu Nome'}</h1>
            <div className="w-16 h-0.5 my-3 mx-auto md:mx-0" style={{ backgroundColor: secondary }} />
            <p className="text-xl capitalize" style={{ color: secondary }}>{data.titulo || 'Executivo'}</p>
            {data.descricao && <p className="text-white/60 mt-2 text-sm">{data.descricao}</p>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {data.sobre && (
          <section className="bg-white p-8 shadow-sm border-l-4" style={{ borderColor: secondary }}>
            <h2 className="text-lg font-bold uppercase tracking-widest mb-4" style={{ color: primary }}>Perfil Profissional</h2>
            <p className="text-gray-700 leading-8">{data.sobre}</p>
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {data.experiencias?.length > 0 && (
            <section className="bg-white p-8 shadow-sm">
              <h2 className="text-lg font-bold uppercase tracking-widest mb-4" style={{ color: primary }}>Experiência</h2>
              <div className="space-y-5">
                {data.experiencias.map((exp, i) => (
                  <div key={i}>
                    <p className="font-bold capitalize" style={{ color: primary }}>{exp.empresa}</p>
                    <p className="italic text-gray-600 capitalize">{exp.cargo}</p>
                    {exp.descricao && <p className="text-sm text-gray-500 mt-1">{exp.descricao}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.educacoes?.length > 0 && (
            <section className="bg-white p-8 shadow-sm">
              <h2 className="text-lg font-bold uppercase tracking-widest mb-4" style={{ color: primary }}>Formação</h2>
              <div className="space-y-4">
                {data.educacoes.map((edu, i) => (
                  <div key={i}>
                    <p className="font-bold capitalize">{edu.instituicao}</p>
                    <p className="italic text-gray-600 capitalize">{edu.curso} {edu.ano && `· ${edu.ano}`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {(data.tecnicas || data.pessoais) && (
          <section className="bg-white p-8 shadow-sm">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-4" style={{ color: primary }}>Competências</h2>
            <div className="flex flex-wrap gap-3">
              {parseSkills(data.tecnicas).map((s, i) => (
                <span key={i} className="px-4 py-1 text-sm font-semibold capitalize" style={{ color: primary, border: `1px solid ${primary}` }}>{s}</span>
              ))}
              {parseSkills(data.pessoais).map((s, i) => (
                <span key={i} className="px-4 py-1 text-sm font-semibold text-white capitalize" style={{ backgroundColor: secondary }}>{s}</span>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white p-8 shadow-sm">
          <h2 className="text-lg font-bold uppercase tracking-widest mb-4" style={{ color: primary }}>Contato</h2>
          <div className="grid md:grid-cols-2 gap-3 text-gray-600 text-sm">
            {data.email && <p>📧 {data.email}</p>}
            {data.telefone && <p>📱 {data.telefone}</p>}
            {data.linkedin && <p>💼 {data.linkedin}</p>}
            {data.instagram && <p>📷 {data.instagram}</p>}
          </div>
          {data.subdominio && <p className="mt-4 text-xs text-gray-400">🔗 {data.subdominio}.meusiteja.com</p>}
        </section>
      </div>
    </div>
  );
}

// ─── TEMPLATE: SAÚDE ──────────────────────────────────────────────────────────
function TemplateSaude({ data }) {
  const primary = data.cor_primaria || '#059669';
  const secondary = data.cor_secundaria || '#0D9488';
  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <div style={{ background: `linear-gradient(120deg, ${primary}, ${secondary})` }} className="px-8 py-14 text-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white/40 shadow-xl flex-shrink-0">
            {data.foto
              ? <img src={data.foto} alt="Foto" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-white/20 flex items-center justify-center text-5xl">🩺</div>}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold capitalize">{data.nome || 'Seu Nome'}</h1>
            <p className="text-xl text-white/80 mt-1 capitalize">{data.titulo || 'Profissional de Saúde'}</p>
            {data.descricao && <p className="text-white/60 mt-2 text-sm">{data.descricao}</p>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {data.sobre && (
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100">
            <h2 className="text-xl font-bold mb-3" style={{ color: primary }}>🌿 Sobre mim</h2>
            <p className="text-gray-600 leading-relaxed">{data.sobre}</p>
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {data.experiencias?.length > 0 && (
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100">
              <h2 className="text-xl font-bold mb-3" style={{ color: secondary }}>🏥 Experiência</h2>
              <div className="space-y-4">
                {data.experiencias.map((exp, i) => (
                  <div key={i} className="border-l-2 pl-3" style={{ borderColor: primary }}>
                    <p className="font-semibold capitalize">{exp.empresa}</p>
                    <p className="text-gray-500 text-sm capitalize">{exp.cargo}</p>
                    {exp.descricao && <p className="text-xs text-gray-400 mt-1">{exp.descricao}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.educacoes?.length > 0 && (
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100">
              <h2 className="text-xl font-bold mb-3" style={{ color: primary }}>🎓 Formação</h2>
              <div className="space-y-4">
                {data.educacoes.map((edu, i) => (
                  <div key={i} className="border-l-2 pl-3" style={{ borderColor: secondary }}>
                    <p className="font-semibold capitalize">{edu.instituicao}</p>
                    <p className="text-sm text-gray-500 capitalize">{edu.curso} {edu.ano && `· ${edu.ano}`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {(data.tecnicas || data.pessoais) && (
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100">
            <h2 className="text-xl font-bold mb-3" style={{ color: primary }}>💊 Especializações</h2>
            <div className="flex flex-wrap gap-2">
              {parseSkills(data.tecnicas).map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-sm text-white capitalize" style={{ backgroundColor: primary }}>{s}</span>
              ))}
              {parseSkills(data.pessoais).map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-sm capitalize" style={{ backgroundColor: '#d1fae5', color: primary }}>{s}</span>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100">
          <h2 className="text-xl font-bold mb-3" style={{ color: secondary }}>📞 Contato</h2>
          <div className="grid md:grid-cols-2 gap-3 text-gray-600 text-sm">
            {data.email && <p>📧 {data.email}</p>}
            {data.telefone && <p>📱 {data.telefone}</p>}
            {data.instagram && <p>📷 {data.instagram}</p>}
            {data.linkedin && <p>💼 {data.linkedin}</p>}
          </div>
          {data.subdominio && <p className="mt-4 text-xs text-gray-400">🔗 {data.subdominio}.meusiteja.com</p>}
        </section>
      </div>
    </div>
  );
}

// ─── TEMPLATE: JURÍDICO ───────────────────────────────────────────────────────
function TemplateJuridico({ data }) {
  const primary = data.cor_primaria || '#78350F';
  const secondary = data.cor_secundaria || '#1C1917';
  return (
    <div className="min-h-screen bg-stone-100" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: secondary }} className="px-10 py-14 text-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 flex-shrink-0" style={{ borderColor: primary }}>
            {data.foto
              ? <img src={data.foto} alt="Foto" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-stone-700 flex items-center justify-center text-4xl">⚖️</div>}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold capitalize tracking-wider">{data.nome || 'Seu Nome'}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="h-px flex-1" style={{ backgroundColor: primary }} />
              <p className="text-sm capitalize tracking-widest uppercase" style={{ color: primary }}>{data.titulo || 'Advogado(a)'}</p>
              <div className="h-px flex-1" style={{ backgroundColor: primary }} />
            </div>
            {data.descricao && <p className="text-stone-400 mt-3 text-sm italic">{data.descricao}</p>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {data.sobre && (
          <section className="bg-white p-8 border border-stone-200">
            <h2 className="text-sm uppercase tracking-widest font-bold mb-4" style={{ color: primary }}>Apresentação</h2>
            <hr className="border-stone-200 mb-4" />
            <p className="text-gray-700 leading-8 text-justify">{data.sobre}</p>
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {data.experiencias?.length > 0 && (
            <section className="bg-white p-8 border border-stone-200">
              <h2 className="text-sm uppercase tracking-widest font-bold mb-4" style={{ color: primary }}>Atuação Profissional</h2>
              <hr className="border-stone-200 mb-4" />
              <div className="space-y-4">
                {data.experiencias.map((exp, i) => (
                  <div key={i}>
                    <p className="font-bold capitalize text-stone-800">{exp.empresa}</p>
                    <p className="italic text-stone-600 capitalize text-sm">{exp.cargo}</p>
                    {exp.descricao && <p className="text-stone-500 text-sm mt-1 text-justify">{exp.descricao}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.educacoes?.length > 0 && (
            <section className="bg-white p-8 border border-stone-200">
              <h2 className="text-sm uppercase tracking-widest font-bold mb-4" style={{ color: primary }}>Formação Acadêmica</h2>
              <hr className="border-stone-200 mb-4" />
              <div className="space-y-4">
                {data.educacoes.map((edu, i) => (
                  <div key={i}>
                    <p className="font-bold capitalize text-stone-800">{edu.instituicao}</p>
                    <p className="italic text-stone-600 text-sm capitalize">{edu.curso} {edu.ano && `· ${edu.ano}`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {(data.tecnicas || data.pessoais) && (
          <section className="bg-white p-8 border border-stone-200">
            <h2 className="text-sm uppercase tracking-widest font-bold mb-4" style={{ color: primary }}>Áreas de Atuação</h2>
            <hr className="border-stone-200 mb-4" />
            <div className="flex flex-wrap gap-3">
              {parseSkills(data.tecnicas).map((s, i) => (
                <span key={i} className="px-4 py-1 text-sm border capitalize" style={{ borderColor: primary, color: primary }}>{s}</span>
              ))}
              {parseSkills(data.pessoais).map((s, i) => (
                <span key={i} className="px-4 py-1 text-sm text-stone-600 capitalize">{s}</span>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white p-8 border border-stone-200">
          <h2 className="text-sm uppercase tracking-widest font-bold mb-4" style={{ color: primary }}>Contato</h2>
          <hr className="border-stone-200 mb-4" />
          <div className="grid md:grid-cols-2 gap-3 text-stone-600 text-sm">
            {data.email && <p>📧 {data.email}</p>}
            {data.telefone && <p>📱 {data.telefone}</p>}
            {data.linkedin && <p>💼 {data.linkedin}</p>}
            {data.instagram && <p>📷 {data.instagram}</p>}
          </div>
          {data.subdominio && <p className="mt-4 text-xs text-stone-400">🔗 {data.subdominio}.meusiteja.com</p>}
        </section>
      </div>
    </div>
  );
}

// ─── TEMPLATE: ACADÊMICO ──────────────────────────────────────────────────────
function TemplateAcademico({ data }) {
  const primary = data.cor_primaria || '#0369A1';
  const secondary = data.cor_secundaria || '#1E3A5F';
  return (
    <div className="min-h-screen bg-sky-50">
      {/* Header */}
      <div style={{ backgroundColor: primary }} className="px-10 py-14 text-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white/30 shadow-xl flex-shrink-0">
            {data.foto
              ? <img src={data.foto} alt="Foto" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-sky-700 flex items-center justify-center text-4xl">🎓</div>}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold capitalize tracking-wide">{data.nome || 'Seu Nome'}</h1>
            <p className="text-xl text-sky-200 mt-1 capitalize">{data.titulo || 'Pesquisador(a)'}</p>
            {data.descricao && <p className="text-sky-300 mt-2 text-sm">{data.descricao}</p>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {data.sobre && (
          <section className="bg-white rounded-xl p-8 shadow-sm border-t-4" style={{ borderColor: primary }}>
            <h2 className="font-bold uppercase tracking-widest text-sm mb-4" style={{ color: primary }}>Resumo Acadêmico</h2>
            <p className="text-gray-700 leading-8 text-justify">{data.sobre}</p>
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {data.experiencias?.length > 0 && (
            <section className="bg-white rounded-xl p-8 shadow-sm border-t-4" style={{ borderColor: secondary }}>
              <h2 className="font-bold uppercase tracking-widest text-sm mb-4" style={{ color: secondary }}>Experiência</h2>
              <div className="space-y-4">
                {data.experiencias.map((exp, i) => (
                  <div key={i} className="pl-4 border-l-2 border-sky-200">
                    <p className="font-semibold capitalize text-gray-800">{exp.empresa}</p>
                    <p className="text-sky-700 text-sm capitalize">{exp.cargo}</p>
                    {exp.descricao && <p className="text-gray-500 text-sm mt-1">{exp.descricao}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.educacoes?.length > 0 && (
            <section className="bg-white rounded-xl p-8 shadow-sm border-t-4" style={{ borderColor: primary }}>
              <h2 className="font-bold uppercase tracking-widest text-sm mb-4" style={{ color: primary }}>Titulação</h2>
              <div className="space-y-4">
                {data.educacoes.map((edu, i) => (
                  <div key={i} className="pl-4 border-l-2 border-sky-200">
                    <p className="font-semibold capitalize text-gray-800">{edu.instituicao}</p>
                    <p className="text-sky-700 text-sm capitalize">{edu.curso} {edu.ano && `· ${edu.ano}`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {(data.tecnicas || data.pessoais) && (
          <section className="bg-white rounded-xl p-8 shadow-sm border-t-4" style={{ borderColor: secondary }}>
            <h2 className="font-bold uppercase tracking-widest text-sm mb-4" style={{ color: secondary }}>Áreas de Conhecimento</h2>
            <div className="flex flex-wrap gap-2">
              {parseSkills(data.tecnicas).map((s, i) => (
                <span key={i} className="px-3 py-1 text-sm rounded text-white capitalize" style={{ backgroundColor: primary }}>{s}</span>
              ))}
              {parseSkills(data.pessoais).map((s, i) => (
                <span key={i} className="px-3 py-1 text-sm rounded capitalize bg-sky-100 text-sky-800">{s}</span>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white rounded-xl p-8 shadow-sm border-t-4" style={{ borderColor: primary }}>
          <h2 className="font-bold uppercase tracking-widest text-sm mb-4" style={{ color: primary }}>Contato</h2>
          <div className="grid md:grid-cols-2 gap-3 text-gray-600 text-sm">
            {data.email && <p>📧 {data.email}</p>}
            {data.telefone && <p>📱 {data.telefone}</p>}
            {data.linkedin && <p>💼 {data.linkedin}</p>}
            {data.instagram && <p>📷 {data.instagram}</p>}
          </div>
          {data.subdominio && <p className="mt-4 text-xs text-gray-400">🔗 {data.subdominio}.meusiteja.com</p>}
        </section>
      </div>
    </div>
  );
}

// ─── TEMPLATE: BELEZA ─────────────────────────────────────────────────────────
function TemplateBeleza({ data }) {
  const primary = data.cor_primaria || '#E11D48';
  const secondary = data.cor_secundaria || '#DB2777';
  return (
    <div className="min-h-screen bg-rose-50">
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} className="px-8 py-16 text-white text-center">
        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl mx-auto mb-6">
          {data.foto
            ? <img src={data.foto} alt="Foto" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-pink-400/30 flex items-center justify-center text-5xl">💅</div>}
        </div>
        <h1 className="text-4xl font-bold capitalize" style={{ fontFamily: '"Georgia", serif' }}>{data.nome || 'Seu Nome'}</h1>
        <p className="text-xl text-white/80 mt-2 capitalize">{data.titulo || 'Esteticista'}</p>
        {data.descricao && <p className="text-white/60 mt-3 text-sm max-w-md mx-auto">{data.descricao}</p>}
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {data.sobre && (
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-rose-100">
            <h2 className="text-xl font-bold mb-3" style={{ color: primary }}>✨ Sobre mim</h2>
            <p className="text-gray-600 leading-relaxed">{data.sobre}</p>
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {data.experiencias?.length > 0 && (
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-rose-100">
              <h2 className="text-xl font-bold mb-3" style={{ color: secondary }}>💄 Experiência</h2>
              <div className="space-y-4">
                {data.experiencias.map((exp, i) => (
                  <div key={i} className="border-l-4 pl-4" style={{ borderColor: primary }}>
                    <p className="font-semibold capitalize">{exp.empresa}</p>
                    <p className="text-sm text-gray-500 capitalize">{exp.cargo}</p>
                    {exp.descricao && <p className="text-xs text-gray-400 mt-1">{exp.descricao}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.educacoes?.length > 0 && (
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-rose-100">
              <h2 className="text-xl font-bold mb-3" style={{ color: primary }}>🎀 Formação</h2>
              <div className="space-y-4">
                {data.educacoes.map((edu, i) => (
                  <div key={i} className="border-l-4 pl-4" style={{ borderColor: secondary }}>
                    <p className="font-semibold capitalize">{edu.instituicao}</p>
                    <p className="text-sm text-gray-500 capitalize">{edu.curso} {edu.ano && `· ${edu.ano}`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {(data.tecnicas || data.pessoais) && (
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-rose-100">
            <h2 className="text-xl font-bold mb-3" style={{ color: primary }}>💕 Serviços & Habilidades</h2>
            <div className="flex flex-wrap gap-2">
              {parseSkills(data.tecnicas).map((s, i) => (
                <span key={i} className="px-4 py-1 rounded-full text-sm text-white capitalize" style={{ background: `linear-gradient(to right, ${primary}, ${secondary})` }}>{s}</span>
              ))}
              {parseSkills(data.pessoais).map((s, i) => (
                <span key={i} className="px-4 py-1 rounded-full text-sm capitalize bg-rose-100 text-rose-700">{s}</span>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white rounded-3xl p-8 shadow-sm border border-rose-100">
          <h2 className="text-xl font-bold mb-3" style={{ color: secondary }}>📲 Contato & Redes</h2>
          <div className="grid md:grid-cols-2 gap-3 text-gray-600 text-sm">
            {data.email && <p>📧 {data.email}</p>}
            {data.telefone && <p>📱 {data.telefone}</p>}
            {data.instagram && <p>📷 {data.instagram}</p>}
            {data.linkedin && <p>💼 {data.linkedin}</p>}
          </div>
          {data.subdominio && <p className="mt-4 text-xs text-gray-400">🔗 {data.subdominio}.meusiteja.com</p>}
        </section>
      </div>
    </div>
  );
}

// ─── TEMPLATE: JOVEM ──────────────────────────────────────────────────────────
function TemplateJovem({ data }) {
  const primary = data.cor_primaria || '#EA580C';
  const secondary = data.cor_secundaria || '#D97706';
  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} className="px-8 py-14 text-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-white/30 shadow-xl flex-shrink-0 -rotate-2">
            {data.foto
              ? <img src={data.foto} alt="Foto" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-white/20 flex items-center justify-center text-5xl">🚀</div>}
          </div>
          <div>
            <h1 className="text-5xl font-black capitalize">{data.nome || 'Seu Nome'}</h1>
            <p className="text-xl font-semibold mt-1 capitalize text-white/80">{data.titulo || 'Estudante'}</p>
            {data.descricao && <p className="text-white/60 mt-2 text-sm">{data.descricao}</p>}
            <div className="flex gap-2 mt-3 flex-wrap">
              {parseSkills(data.tecnicas).slice(0, 3).map((s, i) => (
                <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold capitalize">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {data.sobre && (
          <section className="bg-white rounded-2xl p-8 shadow-sm border-b-4" style={{ borderColor: primary }}>
            <h2 className="text-2xl font-black mb-3" style={{ color: primary }}>Quem sou 🙋</h2>
            <p className="text-gray-600 leading-relaxed">{data.sobre}</p>
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {data.experiencias?.length > 0 && (
            <section className="bg-white rounded-2xl p-8 shadow-sm border-b-4" style={{ borderColor: secondary }}>
              <h2 className="text-2xl font-black mb-3" style={{ color: secondary }}>Experiências 💼</h2>
              <div className="space-y-4">
                {data.experiencias.map((exp, i) => (
                  <div key={i} className="bg-orange-50 rounded-xl p-3">
                    <p className="font-bold capitalize">{exp.empresa}</p>
                    <p className="text-sm text-gray-500 capitalize">{exp.cargo}</p>
                    {exp.descricao && <p className="text-xs text-gray-400 mt-1">{exp.descricao}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.educacoes?.length > 0 && (
            <section className="bg-white rounded-2xl p-8 shadow-sm border-b-4" style={{ borderColor: primary }}>
              <h2 className="text-2xl font-black mb-3" style={{ color: primary }}>Estudos 📚</h2>
              <div className="space-y-3">
                {data.educacoes.map((edu, i) => (
                  <div key={i} className="bg-orange-50 rounded-xl p-3">
                    <p className="font-bold capitalize">{edu.instituicao}</p>
                    <p className="text-sm text-gray-500 capitalize">{edu.curso} {edu.ano && `· ${edu.ano}`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {(data.tecnicas || data.pessoais) && (
          <section className="bg-white rounded-2xl p-8 shadow-sm border-b-4" style={{ borderColor: secondary }}>
            <h2 className="text-2xl font-black mb-3" style={{ color: secondary }}>Skills ⚡</h2>
            <div className="flex flex-wrap gap-2">
              {parseSkills(data.tecnicas).map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-xl text-sm font-bold text-white capitalize" style={{ backgroundColor: primary }}>{s}</span>
              ))}
              {parseSkills(data.pessoais).map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-xl text-sm font-bold capitalize bg-amber-100 text-amber-800">{s}</span>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white rounded-2xl p-8 shadow-sm border-b-4" style={{ borderColor: primary }}>
          <h2 className="text-2xl font-black mb-3" style={{ color: primary }}>Fala comigo 👋</h2>
          <div className="grid md:grid-cols-2 gap-3 text-gray-600 text-sm">
            {data.email && <p>📧 {data.email}</p>}
            {data.telefone && <p>📱 {data.telefone}</p>}
            {data.instagram && <p>📷 {data.instagram}</p>}
            {data.linkedin && <p>💼 {data.linkedin}</p>}
          </div>
          {data.subdominio && <p className="mt-4 text-xs text-gray-400">🔗 {data.subdominio}.meusiteja.com</p>}
        </section>
      </div>
    </div>
  );
}

// ─── TEMPLATE RENDERER (dispatcher) ──────────────────────────────────────────
const TEMPLATES = {
  tech: TemplateTech,
  minimalista: TemplateMinimalista,
  criativo: TemplateCriativo,
  executivo: TemplateExecutivo,
  saude: TemplateSaude,
  juridico: TemplateJuridico,
  academico: TemplateAcademico,
  beleza: TemplateBeleza,
  jovem: TemplateJovem,
};

function TemplateRenderer({ data }) {
  const templateId = data?.template || 'tech';
  const Component = TEMPLATES[templateId] || TemplateTech;
  return <Component data={data} />;
}

export default TemplateRenderer;

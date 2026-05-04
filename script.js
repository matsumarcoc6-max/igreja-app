// ============ DADOS INICIAIS PADRÃO ============
const dadosPadrao = {
  nome: "Igreja Comunidade da Graça",
  slogan: "Conectando vidas · Servindo ao Senhor",
  endereco: "Rua das Flores, 456 — Setor Central, Brasília – DF, CEP 70000-000",
  pix: "comunidadegraca@igreja.org.br",
  devocional: {
    texto: "O Senhor é o meu pastor; nada me faltará. Guia-me mansamente a águas tranquilas.",
    referencia: "Salmos 23:1-2",
    titulo: "A Paz que Excede Todo Entendimento",
    reflexao: "Deus não apenas nos acompanha — Ele nos guia para os lugares de descanso que nossa alma precisa. Hoje, respire. Lembre-se de quem cuida de você."
  },
  cultos: [
    {
      dia: "Domingo, 4 de Maio",
      especial: "Este fim de semana",
      horarios: [
        { hora: "09h00", titulo: "Culto da Manhã", preletor: "Pr. Marcos Oliveira", confirmacoes: 0 },
        { hora: "11h00", titulo: "Escola Bíblica", preletor: "Classes para todas as idades", confirmacoes: 0 },
        { hora: "19h00", titulo: "Culto da Noite", preletor: "Ministério de Louvor", confirmacoes: 0 }
      ]
    },
    {
      dia: "Quarta-feira, 7 de Maio",
      especial: "Semana",
      horarios: [
        { hora: "19h30", titulo: "Culto de Oração", preletor: "Estudo em Efésios", confirmacoes: 0 }
      ]
    }
  ],
  videos: [
    { titulo: "A Fé que Move Montanhas", preletor: "Pr. Marcos Oliveira", duracao: "42:18", link: "https://youtu.be/dQw4w9WgXcQ" },
    { titulo: "Identidade em Cristo", preletor: "Pr. Lucas Ferreira", duracao: "38:54", link: "https://youtu.be/dQw4w9WgXcQ" }
  ],
  celulas: [
    { nome: "Célula Família Abençoada", lider: "Pr. Josias e Sra. Ruth", dia: "Terças, 19h30", endereco: "Rua das Acácias, 142", whatsapp: "5511999999999" },
    { nome: "Jovens Transformados", lider: "Diác. Rafael Costa", dia: "Quintas, 20h00", endereco: "Av. Brasil, 890", whatsapp: "5511988888888" }
  ],
  avisos: [
    { titulo: "Culto do Dia das Mães — 10 de Maio", texto: "Culto especial com homenagens e jantar comunitário.", urgente: true, data: "30 Abr 2026" },
    { titulo: "Arrecadação de Agasalhos", texto: "Até 25 de Maio aceitamos agasalhos em bom estado.", urgente: false, data: "26 Abr 2026" }
  ],
  oracoes: [
    { nome: "Maria Regina", texto: "Peço oração pela saúde da minha mãe, que está internada.", amens: 14, anonimo: false, id: "1" },
    { nome: "João Souza", texto: "Período difícil no emprego. Peço que Deus abra novas portas.", amens: 8, anonimo: false, id: "2" }
  ]
};

// Estado global
let dadosIgreja = { ...dadosPadrao };

// ============ INICIALIZAÇÃO ============
document.addEventListener('DOMContentLoaded', () => {
  carregarDados();
  inicializarNavegacao();
  inicializarAdminTrigger();
  
  // Splash screen
  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.classList.add('hide');
    setTimeout(() => {
      splash.style.display = 'none';
      document.getElementById('app').classList.add('show');
    }, 500);
  }, 2500);
});

// Carregar dados do localStorage
function carregarDados() {
  const saved = localStorage.getItem('igreja_dados');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      dadosIgreja = { ...dadosPadrao, ...parsed };
      dadosIgreja.oracoes = parsed.oracoes || dadosPadrao.oracoes;
    } catch(e) { console.error('Erro ao carregar dados:', e); }
  }
  renderizarTudo();
}

// Salvar dados no localStorage
function salvarDados() {
  localStorage.setItem('igreja_dados', JSON.stringify(dadosIgreja));
}

// Renderizar tudo
function renderizarTudo() {
  document.getElementById('church-name').innerHTML = dadosIgreja.nome;
  document.getElementById('church-slogan').innerHTML = dadosIgreja.slogan;
  document.getElementById('sp-name').innerHTML = dadosIgreja.nome;
  document.getElementById('sp-slogan').innerHTML = dadosIgreja.slogan;
  
  document.getElementById('dev-text').innerHTML = dadosIgreja.devocional.texto;
  document.getElementById('dev-ref').innerHTML = `${dadosIgreja.devocional.referencia} · ${new Date().toLocaleDateString('pt-BR')}`;
  document.getElementById('dev-title').innerHTML = dadosIgreja.devocional.titulo;
  document.getElementById('dev-body').innerHTML = dadosIgreja.devocional.reflexao;
  
  document.getElementById('pix-key').innerHTML = dadosIgreja.pix;
  document.getElementById('endereco-igreja').innerHTML = dadosIgreja.endereco;
  
  renderizarCultos();
  renderizarVideos();
  renderizarCelulas();
  renderizarAvisos();
  renderizarOracoes();
}

// Renderizar cultos
function renderizarCultos() {
  const container = document.getElementById('cultos-container');
  if (!container) return;
  
  container.innerHTML = dadosIgreja.cultos.map(culto => `
    <div class="culto-card">
      <div class="culto-day">
        <div class="culto-day-name">${culto.dia}</div>
        <div class="culto-day-date">${culto.especial}</div>
      </div>
      <div class="culto-body">
        ${culto.horarios.map(h => `
          <div class="culto-item">
            <div class="culto-time">${h.hora}</div>
            <div style="flex:1">
              <div class="culto-info-title">${h.titulo}</div>
              <div class="culto-info-sub">${h.preletor}</div>
              <div class="confirmar-container">
                <button class="btn-confirmar" onclick="confirmarPresenca('${culto.dia}', '${h.hora}')">
                  ${h.confirmacoes > 0 ? '✓ Confirmado' : '✓ Vou Comparecer'}
                </button>
                <span class="confirm-count">${h.confirmacoes} confirmados</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// Confirmar presença
function confirmarPresenca(dia, hora) {
  for (let culto of dadosIgreja.cultos) {
    for (let horario of culto.horarios) {
      if (horario.hora === hora) {
        horario.confirmacoes++;
        salvarDados();
        renderizarCultos();
        showToast('Presença confirmada! 🙏');
        return;
      }
    }
  }
}

// Renderizar vídeos
function renderizarVideos() {
  const container = document.getElementById('videos-container');
  if (!container) return;
  
  container.innerHTML = dadosIgreja.videos.map(video => `
    <div class="video-card" onclick="abrirVideo('${video.link}')">
      <div class="video-thumb">
        <div class="play-btn"><div class="play-icon"></div></div>
        <div class="video-duration">${video.duracao}</div>
      </div>
      <div class="video-info">
        <span class="card-tag">Mensagem</span>
        <div class="card-title">${video.titulo}</div>
        <div class="card-meta"><span>${video.preletor}</span></div>
      </div>
    </div>
  `).join('');
}

// Abrir vídeo
function abrirVideo(link) {
  if (link && link.includes('youtu')) {
    window.open(link, '_blank');
  } else {
    showToast('Vídeo disponível em breve!');
  }
}

// Renderizar células
function renderizarCelulas() {
  const container = document.getElementById('celulas-container');
  if (!container) return;
  
  container.innerHTML = dadosIgreja.celulas.map(celula => `
    <div class="celula-card">
      <div class="celula-header">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:7px;">
          <div>
            <div class="celula-nome">${celula.nome}</div>
            <div class="celula-lider">Líder: ${celula.lider}</div>
          </div>
          <span class="celula-badge aberto">Vagas abertas</span>
        </div>
      </div>
      <div class="celula-body">
        <div class="celula-info">
          <div class="celula-info-row"><span>📅</span><span>${celula.dia}</span></div>
          <div class="celula-info-row"><span>📍</span><span>${celula.endereco}</span></div>
        </div>
        <button class="btn-whatsapp" onclick="enviarWhatsAppCelula('${celula.whatsapp}', '${celula.nome}')">
          💬 Participar via WhatsApp
        </button>
      </div>
    </div>
  `).join('');
}

// Enviar WhatsApp para célula
function enviarWhatsAppCelula(numero, nomeCelula) {
  const mensagem = `Olá! Gostaria de participar da célula "${nomeCelula}". Poderia me dar mais informações?`;
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}

// Renderizar avisos
function renderizarAvisos() {
  const container = document.getElementById('avisos-container');
  if (!container) return;
  
  container.innerHTML = dadosIgreja.avisos.map(aviso => `
    <div class="aviso-card ${aviso.urgente ? 'urgente' : ''}">
      <div class="aviso-label">${aviso.urgente ? '⚠️ Urgente' : '📢 Comunicado'}</div>
      <div class="aviso-title">${aviso.titulo}</div>
      <div class="aviso-text">${aviso.texto}</div>
      <div class="aviso-date">${aviso.data || new Date().toLocaleDateString('pt-BR')}</div>
    </div>
  `).join('');
}

// Renderizar orações
function renderizarOracoes() {
  const container = document.getElementById('lista-oracoes');
  if (!container) return;
  
  if (dadosIgreja.oracoes.length === 0) {
    container.innerHTML = '<div class="card"><div class="card-body" style="text-align:center;">Nenhum pedido de oração ainda. Seja o primeiro a compartilhar! 🙏</div></div>';
    return;
  }
  
  container.innerHTML = dadosIgreja.oracoes.map(oracao => {
    const iniciais = oracao.anonimo ? 'AN' : oracao.nome.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
    const nomeExibido = oracao.anonimo ? 'Anônimo' : oracao.nome;
    return `
      <div class="oracao-item" data-id="${oracao.id}">
        <div class="oracao-header">
          <div class="oracao-avatar">${iniciais}</div>
          <div style="flex:1">
            <div class="oracao-name">${nomeExibido}</div>
            <div class="oracao-text">${oracao.texto}</div>
            <div class="oracao-actions">
              <button class="btn-amem" onclick="darAmem('${oracao.id}')">🙏 Amém</button>
              <span class="amem-count">${oracao.amens} já oraram</span>
              <button class="btn-share-wa" onclick="compartilharOracaoWhatsApp('${oracao.texto}', '${nomeExibido}')">📱 Compartilhar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Dar Amém
function darAmem(id) {
  const oracao = dadosIgreja.oracoes.find(o => o.id === id);
  if (oracao) {
    oracao.amens++;
    salvarDados();
    renderizarOracoes();
    showToast('Amém! Sua intercessão foi registrada ✝');
  }
}

// Enviar oração
function enviarOracao() {
  const nome = document.getElementById('nome-oracao')?.value.trim() || '';
  const texto = document.getElementById('texto-oracao')?.value.trim();
  const anonimo = document.getElementById('anonimo')?.checked || false;
  
  if (!texto) {
    showToast('Escreva seu pedido de oração primeiro.');
    return;
  }
  
  const novaOracao = {
    id: Date.now().toString(),
    nome: nome || 'Irmão(ã)',
    texto: texto,
    amens: 0,
    anonimo: anonimo
  };
  
  dadosIgreja.oracoes.unshift(novaOracao);
  salvarDados();
  renderizarOracoes();
  
  document.getElementById('nome-oracao').value = '';
  document.getElementById('texto-oracao').value = '';
  document.getElementById('anonimo').checked = false;
  
  showToast('Pedido enviado! A igreja ora com você ✝');
}

// Compartilhar oração no WhatsApp
function compartilharOracaoWhatsApp(texto, nome) {
  const mensagem = `🙏 *Pedido de Oração*\n\n${nome} está pedindo oração:\n\n"${texto}"\n\nVamos interceder juntos! ✝`;
  const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}

// Copiar PIX
function copiarPix() {
  const pixKey = document.getElementById('pix-key')?.innerHTML || dadosIgreja.pix;
  navigator.clipboard.writeText(pixKey).catch(() => {});
  showToast('Chave PIX copiada! 💰');
}

// Abrir Google Maps
function abrirMaps() {
  const endereco = encodeURIComponent(dadosIgreja.endereco);
  window.open(`https://www.google.com/maps/search/?api=1&query=${endereco}`, '_blank');
}

// Abrir Waze
function abrirWaze() {
  const endereco = encodeURIComponent(dadosIgreja.endereco);
  window.open(`https://waze.com/ul?q=${endereco}`, '_blank');
}

// Compartilhar endereço
function compartilharEndereco() {
  if (navigator.share) {
    navigator.share({
      title: dadosIgreja.nome,
      text: dadosIgreja.endereco
    });
  } else {
    navigator.clipboard.writeText(dadosIgreja.endereco);
    showToast('Endereço copiado! 📍');
  }
}

// Navegação
function inicializarNavegacao() {
  const botoes = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.section');
  
  botoes.forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionId = btn.getAttribute('data-section');
      
      botoes.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      
      btn.classList.add('active');
      const sectionAtiva = document.getElementById(sectionId);
      if (sectionAtiva) sectionAtiva.classList.add('active');
    });
  });
}

// Trigger admin (clique 7x no header)
let clickCount = 0;
let clickTimeout;
function inicializarAdminTrigger() {
  const header = document.getElementById('admin-trigger');
  if (header) {
    header.addEventListener('click', () => {
      clickCount++;
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => { clickCount = 0; }, 1000);
      
      if (clickCount >= 7) {
        clickCount = 0;
        abrirAdmin();
      }
    });
  }
}

// Abrir admin
function abrirAdmin() {
  document.getElementById('admin-panel').classList.add('open');
}

function fecharAdmin() {
  document.getElementById('admin-panel').classList.remove('open');
  document.getElementById('admin-dashboard').classList.remove('open');
}

// Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Exportar funções globais
window.confirmarPresenca = confirmarPresenca;
window.enviarOracao = enviarOracao;
window.darAmem = darAmem;
window.copiarPix = copiarPix;
window.abrirMaps = abrirMaps;
window.abrirWaze = abrirWaze;
window.compartilharEndereco = compartilharEndereco;
window.compartilharOracaoWhatsApp = compartilharOracaoWhatsApp;
window.enviarWhatsAppCelula = enviarWhatsAppCelula;
window.abrirVideo = abrirVideo;
window.abrirAdmin = abrirAdmin;
window.fecharAdmin = fecharAdmin;
// ADMIN.JS - Painel Administrativo
// Senha padrão: admin123 (mude depois)

let dadosAdmin = null;

function loginAdmin() {
  const senha = document.getElementById('admin-senha').value;
  
  if (senha === 'admin123') {
    document.getElementById('admin-panel').classList.remove('open');
    carregarDashboardAdmin();
  } else {
    showToast('Senha incorreta! Tente: admin123');
  }
}

function carregarDashboardAdmin() {
  // Carregar dados atuais
  const saved = localStorage.getItem('igreja_dados');
  if (saved) {
    dadosAdmin = JSON.parse(saved);
  } else {
    showToast('Erro ao carregar dados');
    return;
  }
  
  // Preencher campos do formulário
  document.getElementById('admin-nome').value = dadosAdmin.nome || '';
  document.getElementById('admin-slogan').value = dadosAdmin.slogan || '';
  document.getElementById('admin-endereco').value = dadosAdmin.endereco || '';
  document.getElementById('admin-pix').value = dadosAdmin.pix || '';
  document.getElementById('admin-dev-texto').value = dadosAdmin.devocional?.texto || '';
  document.getElementById('admin-dev-ref').value = dadosAdmin.devocional?.referencia || '';
  
  // Renderizar listas
  renderizarAdminCultos();
  renderizarAdminCelulas();
  renderizarAdminAvisos();
  renderizarAdminVideos();
  
  // Abrir dashboard
  document.getElementById('admin-dashboard').classList.add('open');
  
  // Configurar abas
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-admin-tab');
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`admin-${tabId}`).classList.add('active');
    });
  });
}

function renderizarAdminCultos() {
  const container = document.getElementById('admin-cultos-lista');
  if (!container) return;
  
  container.innerHTML = dadosAdmin.cultos.map((culto, idxCulto) => `
    <div class="admin-culto-item">
      <input type="text" placeholder="Dia" value="${culto.dia}" data-culto="${idxCulto}" data-field="dia" style="width:100%; margin-bottom:5px; padding:5px;">
      <input type="text" placeholder="Especial" value="${culto.especial}" data-culto="${idxCulto}" data-field="especial" style="width:100%; margin-bottom:10px; padding:5px;">
      ${culto.horarios.map((h, idxHora) => `
        <div style="margin-left:15px; margin-top:10px; padding-left:10px; border-left:2px solid #B8972A;">
          <input type="text" placeholder="Hora" value="${h.hora}" data-culto="${idxCulto}" data-hora="${idxHora}" data-field="hora" style="width:100%; margin-bottom:5px; padding:5px;">
          <input type="text" placeholder="Título" value="${h.titulo}" data-culto="${idxCulto}" data-hora="${idxHora}" data-field="titulo" style="width:100%; margin-bottom:5px; padding:5px;">
          <input type="text" placeholder="Preletor" value="${h.preletor}" data-culto="${idxCulto}" data-hora="${idxHora}" data-field="preletor" style="width:100%; margin-bottom:5px; padding:5px;">
        </div>
      `).join('')}
    </div>
  `).join('');
  
  // Adicionar eventos para salvar automaticamente
  document.querySelectorAll('#admin-cultos-lista input').forEach(input => {
    input.addEventListener('change', salvarCultos);
  });
}

function salvarCultos() {
  const items = document.querySelectorAll('.admin-culto-item');
  items.forEach((item, idxCulto) => {
    const dia = item.querySelector(`input[data-field="dia"]`)?.value;
    const especial = item.querySelector(`input[data-field="especial"]`)?.value;
    if (dia) dadosAdmin.cultos[idxCulto].dia = dia;
    if (especial) dadosAdmin.cultos[idxCulto].especial = especial;
    
    const horarios = item.querySelectorAll('[data-field="hora"]');
    horarios.forEach((hInput, idxHora) => {
      if (dadosAdmin.cultos[idxCulto]?.horarios[idxHora]) {
        const hora = hInput.value;
        const titulo = item.querySelector(`input[data-culto="${idxCulto}"][data-hora="${idxHora}"][data-field="titulo"]`)?.value;
        const preletor = item.querySelector(`input[data-culto="${idxCulto}"][data-hora="${idxHora}"][data-field="preletor"]`)?.value;
        if (hora) dadosAdmin.cultos[idxCulto].horarios[idxHora].hora = hora;
        if (titulo) dadosAdmin.cultos[idxCulto].horarios[idxHora].titulo = titulo;
        if (preletor) dadosAdmin.cultos[idxCulto].horarios[idxHora].preletor = preletor;
      }
    });
  });
  
  localStorage.setItem('igreja_dados', JSON.stringify(dadosAdmin));
  showToast('Cultos salvos!');
}

function renderizarAdminCelulas() {
  const container = document.getElementById('admin-celulas-lista');
  if (!container) return;
  
  container.innerHTML = dadosAdmin.celulas.map((celula, idx) => `
    <div class="admin-celula-item" style="background:#f5f5f5; padding:10px; margin-bottom:10px; border-radius:5px;">
      <input type="text" placeholder="Nome da célula" value="${celula.nome}" data-cell="${idx}" data-field="nome" style="width:100%; margin-bottom:5px; padding:5px;">
      <input type="text" placeholder="Líder" value="${celula.lider}" data-cell="${idx}" data-field="lider" style="width:100%; margin-bottom:5px; padding:5px;">
      <input type="text" placeholder="Dia e horário" value="${celula.dia}" data-cell="${idx}" data-field="dia" style="width:100%; margin-bottom:5px; padding:5px;">
      <input type="text" placeholder="Endereço" value="${celula.endereco}" data-cell="${idx}" data-field="endereco" style="width:100%; margin-bottom:5px; padding:5px;">
      <input type="text" placeholder="WhatsApp (código+numero)" value="${celula.whatsapp}" data-cell="${idx}" data-field="whatsapp" style="width:100%; margin-bottom:5px; padding:5px;">
      <button class="admin-delete" onclick="deletarCelula(${idx})" style="background:#C0392B; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Excluir</button>
    </div>
  `).join('');
  
  document.querySelectorAll('#admin-celulas-lista input').forEach(input => {
    input.addEventListener('change', salvarCelulas);
  });
}

function salvarCelulas() {
  const items = document.querySelectorAll('.admin-celula-item');
  items.forEach((item, idx) => {
    const nome = item.querySelector(`input[data-field="nome"]`)?.value;
    const lider = item.querySelector(`input[data-field="lider"]`)?.value;
    const dia = item.querySelector(`input[data-field="dia"]`)?.value;
    const endereco = item.querySelector(`input[data-field="endereco"]`)?.value;
    const whatsapp = item.querySelector(`input[data-field="whatsapp"]`)?.value;
    
    if (dadosAdmin.celulas[idx]) {
      if (nome) dadosAdmin.celulas[idx].nome = nome;
      if (lider) dadosAdmin.celulas[idx].lider = lider;
      if (dia) dadosAdmin.celulas[idx].dia = dia;
      if (endereco) dadosAdmin.celulas[idx].endereco = endereco;
      if (whatsapp) dadosAdmin.celulas[idx].whatsapp = whatsapp;
    }
  });
  
  localStorage.setItem('igreja_dados', JSON.stringify(dadosAdmin));
  showToast('Células salvas!');
}

function adicionarCelula() {
  dadosAdmin.celulas.push({
    nome: "Nova Célula",
    lider: "Líder",
    dia: "Dia, Horário",
    endereco: "Endereço",
    whatsapp: "5511999999999"
  });
  localStorage.setItem('igreja_dados', JSON.stringify(dadosAdmin));
  renderizarAdminCelulas();
  showToast('Nova célula adicionada!');
}

function deletarCelula(idx) {
  if (confirm('Tem certeza que deseja excluir esta célula?')) {
    dadosAdmin.celulas.splice(idx, 1);
    localStorage.setItem('igreja_dados', JSON.stringify(dadosAdmin));
    renderizarAdminCelulas();
    showToast('Célula excluída!');
  }
}

function renderizarAdminAvisos() {
  const container = document.getElementById('admin-avisos-lista');
  if (!container) return;
  
  container.innerHTML = dadosAdmin.avisos.map((aviso, idx) => `
    <div class="admin-aviso-item" style="background:#f5f5f5; padding:10px; margin-bottom:10px; border-radius:5px;">
      <input type="text" placeholder="Título" value="${aviso.titulo}" data-aviso="${idx}" data-field="titulo" style="width:100%; margin-bottom:5px; padding:5px;">
      <textarea placeholder="Texto" data-aviso="${idx}" data-field="texto" rows="2" style="width:100%; margin-bottom:5px; padding:5px;">${aviso.texto}</textarea>
      <label style="display:flex; align-items:center; gap:5px; margin-bottom:5px;">
        <input type="checkbox" ${aviso.urgente ? 'checked' : ''} data-aviso="${idx}" data-field="urgente">
        Urgente
      </label>
      <input type="text" placeholder="Data" value="${aviso.data || ''}" data-aviso="${idx}" data-field="data" style="width:100%; margin-bottom:5px; padding:5px;">
      <button class="admin-delete" onclick="deletarAviso(${idx})" style="background:#C0392B; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Excluir</button>
    </div>
  `).join('');
  
  document.querySelectorAll('#admin-avisos-lista input, #admin-avisos-lista textarea').forEach(input => {
    input.addEventListener('change', salvarAvisos);
  });
}

function salvarAvisos() {
  const items = document.querySelectorAll('.admin-aviso-item');
  items.forEach((item, idx) => {
    const titulo = item.querySelector(`input[data-field="titulo"]`)?.value;
    const texto = item.querySelector(`textarea[data-field="texto"]`)?.value;
    const urgente = item.querySelector(`input[data-field="urgente"]`)?.checked;
    const data = item.querySelector(`input[data-field="data"]`)?.value;
    
    if (dadosAdmin.avisos[idx]) {
      if (titulo) dadosAdmin.avisos[idx].titulo = titulo;
      if (texto) dadosAdmin.avisos[idx].texto = texto;
      dadosAdmin.avisos[idx].urgente = urgente || false;
      if (data) dadosAdmin.avisos[idx].data = data;
    }
  });
  
  localStorage.setItem('igreja_dados', JSON.stringify(dadosAdmin));
  showToast('Avisos salvos!');
}

function adicionarAviso() {
  dadosAdmin.avisos.push({
    titulo: "Novo Aviso",
    texto: "Descrição do aviso...",
    urgente: false,
    data: new Date().toLocaleDateString('pt-BR')
  });
  localStorage.setItem('igreja_dados', JSON.stringify(dadosAdmin));
  renderizarAdminAvisos();
  showToast('Novo aviso adicionado!');
}

function deletarAviso(idx) {
  if (confirm('Tem certeza que deseja excluir este aviso?')) {
    dadosAdmin.avisos.splice(idx, 1);
    localStorage.setItem('igreja_dados', JSON.stringify(dadosAdmin));
    renderizarAdminAvisos();
    showToast('Aviso excluído!');
  }
}

function renderizarAdminVideos() {
  const container = document.getElementById('admin-videos-lista');
  if (!container) return;
  
  container.innerHTML = dadosAdmin.videos.map((video, idx) => `
    <div class="admin-video-item" style="background:#f5f5f5; padding:10px; margin-bottom:10px; border-radius:5px;">
      <input type="text" placeholder="Título" value="${video.titulo}" data-video="${idx}" data-field="titulo" style="width:100%; margin-bottom:5px; padding:5px;">
      <input type="text" placeholder="Preletor" value="${video.preletor}" data-video="${idx}" data-field="preletor" style="width:100%; margin-bottom:5px; padding:5px;">
      <input type="text" placeholder="Duração (ex: 42:18)" value="${video.duracao}" data-video="${idx}" data-field="duracao" style="width:100%; margin-bottom:5px; padding:5px;">
      <input type="text" placeholder="Link do YouTube" value="${video.link}" data-video="${idx}" data-field="link" style="width:100%; margin-bottom:5px; padding:5px;">
      <button class="admin-delete" onclick="deletarVideo(${idx})" style="background:#C0392B; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Excluir</button>
    </div>
  `).join('');
  
  document.querySelectorAll('#admin-videos-lista input').forEach(input => {
    input.addEventListener('change', salvarVideos);
  });
}

function salvarVideos() {
  const items = document.querySelectorAll('.admin-video-item');
  items.forEach((item, idx) => {
    const titulo = item.querySelector(`input[data-field="titulo"]`)?.value;
    const preletor = item.querySelector(`input[data-field="preletor"]`)?.value;
    const duracao = item.querySelector(`input[data-field="duracao"]`)?.value;
    const link = item.querySelector(`input[data-field="link"]`)?.value;
    
    if (dadosAdmin.videos[idx]) {
      if (titulo) dadosAdmin.videos[idx].titulo = titulo;
      if (preletor) dadosAdmin.videos[idx].preletor = preletor;
      if (duracao) dadosAdmin.videos[idx].duracao = duracao;
      if (link) dadosAdmin.videos[idx].link = link;
    }
  });
  
  localStorage.setItem('igreja_dados', JSON.stringify(dadosAdmin));
  showToast('Vídeos salvos!');
}

function adicionarVideo() {
  dadosAdmin.videos.push({
    titulo: "Novo Vídeo",
    preletor: "Preletor",
    duracao: "30:00",
    link: "https://youtu.be/..."
  });
  localStorage.setItem('igreja_dados', JSON.stringify(dadosAdmin));
  renderizarAdminVideos();
  showToast('Novo vídeo adicionado!');
}

function deletarVideo(idx) {
  if (confirm('Tem certeza que deseja excluir este vídeo?')) {
    dadosAdmin.videos.splice(idx, 1);
    localStorage.setItem('igreja_dados', JSON.stringify(dadosAdmin));
    renderizarAdminVideos();
    showToast('Vídeo excluído!');
  }
}

function salvarConfigGeral() {
  const nome = document.getElementById('admin-nome').value;
  const slogan = document.getElementById('admin-slogan').value;
  const endereco = document.getElementById('admin-endereco').value;
  const pix = document.getElementById('admin-pix').value;
  const devTexto = document.getElementById('admin-dev-texto').value;
  const devRef = document.getElementById('admin-dev-ref').value;
  
  dadosAdmin.nome = nome;
  dadosAdmin.slogan = slogan;
  dadosAdmin.endereco = endereco;
  dadosAdmin.pix = pix;
  dadosAdmin.devocional.texto = devTexto;
  dadosAdmin.devocional.referencia = devRef;
  
  localStorage.setItem('igreja_dados', JSON.stringify(dadosAdmin));
  showToast('Configurações salvas! Recarregando...');
  
  setTimeout(() => {
    location.reload();
  }, 1500);
}

function fecharAdmin() {
  document.getElementById('admin-panel').classList.remove('open');
  document.getElementById('admin-dashboard').classList.remove('open');
}
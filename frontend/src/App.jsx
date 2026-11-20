import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  Copy,
  Github,
  Headphones,
  LoaderCircle,
  Menu,
  MessageCircle,
  MessageSquareText,
  Package,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';

const SUGESTOES = [
  { titulo: 'Acompanhar pedido', texto: 'Quero consultar o pedido 1001', icon: Package },
  { titulo: 'Prazo de entrega', texto: 'Qual é o prazo de entrega?', icon: Clock3 },
  { titulo: 'Horário de atendimento', texto: 'Qual é o horário de atendimento?', icon: CircleHelp },
];

const MENSAGEM_INICIAL = {
  id: 'boas-vindas',
  role: 'assistant',
  text: 'Olá! 👋 Sou o AtendeIA, seu assistente virtual. Posso ajudar você a consultar pedidos e tirar dúvidas sobre a nossa loja fictícia. Como posso ajudar?',
  time: '',
};

function agora() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function criarMensagem(role, text, error = false) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    text,
    time: agora(),
    error,
  };
}

function extrairCodigoPedido(texto) {
  const resultado = texto.match(/\bpedido\s*(?:n[úu]mero\s*)?#?\s*(\d+)\b/i);
  return resultado?.[1] ?? null;
}

function Logo() {
  return (
    <div className="brand" aria-label="AtendeIA">
      <div className="brand-mark"><MessageCircle size={22} strokeWidth={2.5} /></div>
      <div>
        <div className="brand-name">Atende<span>IA</span></div>
        <div className="brand-caption">CUSTOMER EXPERIENCE</div>
      </div>
    </div>
  );
}

function Sidebar({ onNovaConversa, onSugestao, aberto, fechar }) {
  return (
    <>
      {aberto && <button className="mobile-backdrop" aria-label="Fechar menu" onClick={fechar} />}
      <aside className={`sidebar ${aberto ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand-row">
            <Logo />
            <button className="icon-button mobile-only" aria-label="Fechar menu" onClick={fechar}><X size={20} /></button>
          </div>
          <button className="new-chat" onClick={() => { onNovaConversa(); fechar(); }}>
            <Plus size={18} /> Nova conversa
            <span className="new-chat-shortcut">+</span>
          </button>
        </div>

        <nav className="side-navigation" aria-label="Navegação">
          <div className="section-label">ESPAÇO DE TRABALHO</div>
          <div className="nav-current"><MessageSquareText size={18} /><span>Atendimento</span><span className="nav-dot" /></div>
          <a className="nav-link" href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer">
            <Code2 size={18} /><span>Documentação API</span><ArrowRight size={15} className="nav-arrow" />
          </a>
          <div className="section-label section-label-secondary">ATALHOS RÁPIDOS</div>
          {SUGESTOES.map(({ titulo, texto, icon: Icon }) => (
            <button key={titulo} className="nav-link" onClick={() => { onSugestao(texto); fechar(); }}>
              <Icon size={18} /><span>{titulo}</span><ChevronRight size={16} className="nav-arrow" />
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <div className="tip-icon"><Sparkles size={18} /></div>
            <strong>Projeto em evolução</strong>
            <p>Hoje: atendimento baseado em regras. Próximo passo: integrar IA generativa.</p>
          </div>
          <div className="sidebar-footer"><div className="footer-avatar">D</div><div><strong>Ambiente de demonstração</strong><span>Dados 100% fictícios</span></div><ShieldCheck size={17} /></div>
        </div>
      </aside>
    </>
  );
}

function Mensagem({ mensagem, onCopiar, copiada }) {
  const isBot = mensagem.role === 'assistant';
  return (
    <div className={`message-row ${isBot ? 'message-row-bot' : 'message-row-user'}`}>
      {isBot && <div className="message-avatar" aria-label="AtendeIA"><Bot size={18} /></div>}
      <div className="message-content">
        <div className="message-meta"><strong>{isBot ? 'AtendeIA' : 'Você'}</strong>{mensagem.time && <span>{mensagem.time}</span>}</div>
        <div className={`bubble ${isBot ? 'bubble-bot' : 'bubble-user'} ${mensagem.error ? 'bubble-error' : ''}`}>{mensagem.text}</div>
        {isBot && !mensagem.error && mensagem.id !== 'boas-vindas' && (
          <button className="copy-answer" title="Copiar resposta" aria-label="Copiar resposta" onClick={() => onCopiar(mensagem)}>
            {copiada === mensagem.id ? <><Check size={13}/> Copiado</> : <><Copy size={13}/> Copiar</>}
          </button>
        )}
      </div>
    </div>
  );
}

function OrderCard({ pedido, carregando, erro, onConsultar }) {
  return (
    <section className="detail-card order-card" aria-labelledby="order-title">
      <div className="card-heading"><div className="card-heading-icon"><Package size={18}/></div><h2 id="order-title">Consulta de pedidos</h2></div>
      {carregando ? <div className="order-loading"><LoaderCircle className="spin" size={20}/> Buscando pedido...</div> : pedido ? (
        <div className="order-result">
          <div className="order-result-header"><span>Pedido #{pedido.codigo}</span><CheckCircle2 size={18}/></div>
          <span className="order-field">STATUS ATUAL</span>
          <div className="order-status">{pedido.status}</div>
          <div className="order-divider" />
          <span className="order-field">PREVISÃO DE ENTREGA</span>
          <div className="order-date">{new Date(`${pedido.previsao_entrega}T12:00:00`).toLocaleDateString('pt-BR')}</div>
        </div>
      ) : (
        <p className="muted card-body">Consulte um dos pedidos de teste para acompanhar a situação da entrega.</p>
      )}
      {erro && <p className="order-error" role="alert">{erro}</p>}
      <div className="orders-list-label">PEDIDOS DE DEMONSTRAÇÃO</div>
      <div className="demo-orders">
        {['1001', '1002', '1003'].map(codigo => (
          <button key={codigo} className="demo-order" onClick={() => onConsultar(`Quero consultar o pedido ${codigo}`)}>
            <span><Package size={15}/> Pedido {codigo}</span><ChevronRight size={16}/>
          </button>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [mensagens, setMensagens] = useState([MENSAGEM_INICIAL]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [pedido, setPedido] = useState(null);
  const [carregandoPedido, setCarregandoPedido] = useState(false);
  const [erroPedido, setErroPedido] = useState('');
  const [copiada, setCopiada] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const fimRef = useRef(null);
  const campoRef = useRef(null);
  const enviandoRef = useRef(false);

  useEffect(() => { fimRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [mensagens, enviando]);

  function novaConversa() {
    setMensagens([MENSAGEM_INICIAL]);
    setTexto('');
    setPedido(null);
    setErroPedido('');
    campoRef.current?.focus();
  }

  async function copiarResposta(mensagem) {
    try {
      await navigator.clipboard.writeText(mensagem.text);
      setCopiada(mensagem.id);
    } catch {
      setCopiada('');
    }
  }

  async function consultarPedido(codigo) {
    setCarregandoPedido(true);
    setErroPedido('');
    setPedido(null);
    try {
      const resp = await fetch(`/pedidos/${encodeURIComponent(codigo)}`);
      if (resp.status === 404) { setErroPedido(`Pedido ${codigo} não encontrado.`); return; }
      if (!resp.ok) throw new Error('Erro na consulta');
      setPedido(await resp.json());
    } catch {
      setErroPedido('Não foi possível carregar o pedido. Confira se o FastAPI está ligado.');
    } finally {
      setCarregandoPedido(false);
    }
  }

  async function enviarMensagem(textoDireto) {
    const mensagem = (typeof textoDireto === 'string' ? textoDireto : texto).trim();
    if (!mensagem || enviandoRef.current) return;
    enviandoRef.current = true;
    setEnviando(true);
    setTexto('');
    setMensagens(lista => [...lista, criarMensagem('user', mensagem)]);

    try {
      const respostaHttp = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: mensagem }),
      });
      if (!respostaHttp.ok) throw new Error(`HTTP ${respostaHttp.status}`);
      const dados = await respostaHttp.json();
      if (typeof dados.resposta !== 'string') throw new Error('Resposta inesperada');
      setMensagens(lista => [...lista, criarMensagem('assistant', dados.resposta)]);

      const codigo = extrairCodigoPedido(mensagem);
      if (codigo) await consultarPedido(codigo);
    } catch {
      setMensagens(lista => [...lista, criarMensagem('assistant', 'Não consegui acessar o servidor agora. Verifique se o FastAPI está em execução e tente novamente.', true)]);
    } finally {
      enviandoRef.current = false;
      setEnviando(false);
      campoRef.current?.focus();
    }
  }

  function onTecla(evento) {
    if (evento.key === 'Enter' && !evento.shiftKey) {
      evento.preventDefault();
      enviarMensagem();
    }
  }

  return (
    <div className="app-shell">
      <Sidebar onNovaConversa={novaConversa} onSugestao={enviarMensagem} aberto={menuAberto} fechar={() => setMenuAberto(false)} />
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" aria-label="Abrir menu" onClick={() => setMenuAberto(true)}><Menu size={22}/></button>
            <div className="breadcrumb">Workspace <ChevronRight size={15}/> <strong>Atendimento</strong></div>
          </div>
          <div className="topbar-right"><span className="topbar-badge"><span className="purple-dot"/> Versão de demonstração</span><div className="user-avatar">AI</div></div>
        </header>

        <div className="content-area">
          <div className="page-heading">
            <div><div className="eyebrow"><span className="eyebrow-line"/> CENTRAL DE ATENDIMENTO</div><h1>Seu assistente, <span>sempre à disposição.</span></h1><p>Converse com o AtendeIA e acompanhe seus pedidos em um só lugar.</p></div>
            <div className="header-decoration" aria-hidden="true"><Sparkles size={25}/></div>
          </div>

          <div className="content-grid">
            <section className="chat-panel" aria-labelledby="chat-title">
              <div className="chat-header">
                <div className="chat-header-left"><div className="chat-header-icon"><Bot size={23}/></div><div><h2 id="chat-title">Assistente AtendeIA</h2><p><span className="available-dot"/> Atendimento automatizado • baseado em regras</p></div></div>
                <button className="icon-button reset-button" aria-label="Iniciar nova conversa" title="Nova conversa" onClick={novaConversa}><Plus size={20}/></button>
              </div>

              <div className="chat-content" aria-live="polite" aria-relevant="additions text">
                <div className="chat-date"><span>CONVERSA ATUAL</span></div>
                {mensagens.map(mensagem => <Mensagem key={mensagem.id} mensagem={mensagem} onCopiar={copiarResposta} copiada={copiada}/>) }
                {enviando && <div className="message-row message-row-bot"><div className="message-avatar"><Bot size={18}/></div><div className="typing-bubble" aria-label="Aguardando resposta"><span/><span/><span/></div></div>}
                <div ref={fimRef}/>
              </div>

              <div className="chat-bottom">
                {mensagens.length === 1 && (
                  <div className="suggestion-row">
                    {SUGESTOES.map(({ titulo, texto: sugestao, icon: Icon }) => <button key={titulo} disabled={enviando} className="suggestion-chip" onClick={() => enviarMensagem(sugestao)}><Icon size={15}/>{titulo}</button>)}
                  </div>
                )}
                <div className="composer">
                  <textarea ref={campoRef} placeholder="Digite sua mensagem aqui..." rows="1" value={texto} onChange={e => setTexto(e.target.value)} onKeyDown={onTecla} maxLength={800} aria-label="Mensagem para o AtendeIA"/>
                  <button className="send-button" onClick={() => enviarMensagem()} disabled={enviando || !texto.trim()} aria-label="Enviar mensagem">{enviando ? <LoaderCircle size={19} className="spin"/> : <Send size={19}/>}</button>
                </div>
                <div className="composer-caption"><span>Pressione <kbd>Enter</kbd> para enviar · <kbd>Shift + Enter</kbd> para nova linha</span><span>{texto.length}/800</span></div>
              </div>
            </section>

            <aside className="right-panel">
              <div className="insight-card"><div className="insight-decoration"><Sparkles size={70}/></div><div className="insight-top"><span><Sparkles size={15}/> EM DESENVOLVIMENTO</span></div><h2>Uma experiência mais inteligente está chegando.</h2><p>Próxima etapa: adicionar um modelo de IA ao chatbot e ampliar as respostas.</p><div className="insight-bottom"><span>Etapa 4 de 6</span><div className="progress-track"><div className="progress-fill"/></div></div></div>
              <OrderCard pedido={pedido} carregando={carregandoPedido} erro={erroPedido} onConsultar={enviarMensagem}/>
              <section className="detail-card about-card"><div className="card-heading"><div className="card-heading-icon"><ShieldCheck size={18}/></div><h2>Sobre o ambiente</h2></div><p>Esta é uma demonstração acadêmica. Os pedidos são fictícios e o chatbot ainda não utiliza inteligência artificial.</p><div className="tech-tags"><span>React</span><span>FastAPI</span><span>SQLite</span></div></section>
            </aside>
          </div>
          <footer className="page-footer"><span>© AtendeIA · Projeto de portfólio</span><span><Headphones size={14}/> Ambiente local de desenvolvimento</span></footer>
        </div>
      </main>
    </div>
  );
}

export default App;

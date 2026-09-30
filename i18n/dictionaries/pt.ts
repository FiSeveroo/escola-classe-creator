// Dicionário de referência. en.ts e es.ts precisam ter exatamente as mesmas chaves
// (o tipo Dictionary garante isso em tempo de compilação).
// Placeholders no formato {nome} são preenchidos com fmt() de '@/i18n/format'.

const pt = {
  meta: {
    title: 'Escola Classe Creator — Formação gratuita para criadores',
    description:
      'Entenda o jogo das plataformas digitais. Formação gratuita para criadores de conteúdo, editores, designers e gestores de comunidade.',
    ogDescription: 'Entenda o jogo das plataformas digitais. Formação gratuita para criadores de conteúdo.',
    twitterDescription: 'Formação gratuita para criadores de conteúdo. A revolução não cabe no feed.',
    keywords: ['criadores de conteúdo', 'algoritmo', 'plataformas digitais', 'formação gratuita', 'classe creator', 'influência digital'],
    sobre: 'Sobre',
    termos: 'Termos de Uso',
    privacidade: 'Política de Privacidade',
  },
  comum: {
    escola: 'ESCOLA',
    usuario: 'Usuário',
    criador: 'Criador',
    carregando: 'Carregando...',
    aguarde: 'AGUARDE...',
    voltar: 'VOLTAR',
    cancelar: 'CANCELAR',
    salvar: 'SALVAR',
    fechar: 'Fechar',
    idioma: 'Idioma',
    aulas: 'aulas',
    gratuito: 'Gratuito',
    emBreve: 'Em breve',
    emBreveCaps: 'EM BREVE',
    bloqueada: 'Bloqueada',
    nucleoObrigatorio: 'NÚCLEO OBRIGATÓRIO',
    trilhasEspecificas: 'TRILHAS ESPECÍFICAS',
    trilhaEspecifica: 'TRILHA ESPECÍFICA',
    concluaNucleo: 'conclua o núcleo para acessar',
    aulasFracao: '{done}/{total} aulas',
  },
  nav: {
    inicio: 'INÍCIO',
    trilhas: 'TRILHAS',
    perfil: 'PERFIL',
    sobre: 'SOBRE',
    sair: 'SAIR',
  },
  login: {
    subtitulo: 'ESCOLA — ACESSO GRATUITO',
    entrar: 'ENTRAR',
    cadastrar: 'CADASTRAR',
    criarConta: 'CRIAR CONTA',
    enviarEmail: 'ENVIAR E-MAIL',
    redefinirSenha: 'REDEFINIR SENHA',
    redefinirInstrucao: 'Digite seu e-mail e enviaremos um link para redefinir sua senha.',
    google: 'Continuar com Google',
    ou: 'OU',
    nome: 'NOME',
    nomePlaceholder: 'Seu nome completo',
    email: 'E-MAIL',
    emailPlaceholder: 'seu@email.com',
    senha: 'SENHA',
    esqueci: 'Esqueci minha senha',
    voltarLogin: '← Voltar ao login',
    gratuito: '100% gratuito. Sem pegadinhas.',
    aceiteAntes: 'Ao criar conta você concorda com os',
    aceiteTermos: 'Termos de Uso',
    aceiteE: 'e a',
    aceitePrivacidade: 'Política de Privacidade',
    erroGoogle: 'Erro ao conectar com Google.',
    erroOauth: 'Não foi possível concluir o login com Google. Tente novamente.',
    erroCredenciais: 'E-mail ou senha incorretos.',
    erroJaCadastrado:
      'Este e-mail já tem uma conta cadastrada. Use a opção "Esqueci minha senha" abaixo se precisar acessar.',
    erroCadastro: 'Erro ao criar conta. Tente novamente.',
    erroEnvioEmail: 'Erro ao enviar e-mail. Verifique o endereço.',
    erroConfig: 'Erro de configuração. Tente novamente.',
    erroCaptcha: 'Confirme que você não é um robô antes de continuar.',
    erroCaptchaFalhou: 'A verificação anti-bot falhou. Recarregue a página e tente novamente.',
    sucessoCadastro: 'Cadastro realizado! Verifique sua caixa de entrada e confirme o e-mail antes de fazer login.',
    heroTitulo: 'A revolução não cabe no feed',
    heroTexto: 'Formação gratuita para entender o jogo das plataformas digitais — de dentro pra fora.',
    heroItens: ['Trilhas por área: YouTube, TikTok e Design', 'Vídeo, material em PDF e quiz em cada aula', 'Certificado gratuito ao concluir uma trilha'],
    tituloEntrar: 'Bem-vindo de volta',
    tituloCadastro: 'Crie sua conta',
    textoEntrar: 'Entre para continuar sua formação.',
    textoCadastro: 'Leva menos de um minuto.',
    sucessoReset: 'E-mail de redefinição enviado! Verifique sua caixa de entrada.',
  },
  redefinir: {
    titulo: 'REDEFINIR SENHA',
    instrucao: 'Digite sua nova senha abaixo.',
    novaSenha: 'NOVA SENHA',
    confirmar: 'CONFIRMAR SENHA',
    salvar: 'SALVAR NOVA SENHA',
    erroTamanho: 'A senha deve ter pelo menos 6 caracteres.',
    erroDiferentes: 'As senhas não coincidem.',
    erroExpirado: 'Erro ao redefinir senha. O link pode ter expirado.',
    sucessoTitulo: 'SENHA ALTERADA!',
    sucessoTexto: 'Redirecionando para o dashboard...',
  },
  dashboard: {
    bemVindo: 'BEM-VINDO DE VOLTA',
    slogan: 'A REVOLUÇÃO NÃO CABE NO FEED',
    progressoGeral: 'PROGRESSÃO GERAL',
    aulasConcluidasDe: '{done} de {total} aulas concluídas',
    baseTodas: 'BASE PARA TODAS AS TRILHAS',
    mural: 'MURAL DE AVISOS',
    muralVazio: 'Nenhum aviso no momento.',
    ola: 'Olá, {nome}',
    continuar: 'Continue de onde parou',
    comecarJornada: 'Comece sua jornada',
    ctaContinuar: 'CONTINUAR AULA',
    ctaComecar: 'COMEÇAR AGORA',
    tudoConcluido: 'Você concluiu todas as aulas disponíveis. Novas trilhas chegam em breve.',
    verTodas: 'Ver todas',
    trilhaN: 'TRILHA {n}',
    concluida: 'Concluída',
    disponivel: 'Disponível',
    paraDesbloquear: 'PARA DESBLOQUEAR',
    concluaO: 'Conclua o',
    nucleoObrigatorio: 'Núcleo Obrigatório',
    popup: {
      comoFunciona: 'COMO FUNCIONA',
      titulo: 'ESCOLA CLASSE CREATOR',
      anterior: 'ANTERIOR',
      proximo: 'PRÓXIMO',
      comecar: 'COMEÇAR AGORA',
      pular: 'pular introdução',
      cards: [
        {
          titulo: 'Bem-vindo à Escola',
          texto:
            'A Escola Classe Creator é uma formação gratuita para criadores de conteúdo. Aqui você vai entender o jogo das plataformas de dentro pra fora.',
        },
        {
          titulo: 'Núcleo Obrigatório',
          texto:
            'Antes de qualquer trilha específica, você precisa concluir o Núcleo. São 5 aulas sobre algoritmos, atenção e lógica das plataformas — a base de tudo.',
        },
        {
          titulo: 'Trilhas Específicas',
          texto:
            'Após o Núcleo, você desbloqueia trilhas por área: YouTube, TikTok, Design e mais. Cada trilha tem aulas, PDF e quiz obrigatório.',
        },
        {
          titulo: 'Progressão por etapas',
          texto:
            'Cada aula exige que você assista o vídeo, baixe o PDF e passe no quiz. Só assim a próxima aula é liberada. Sem atalhos.',
        },
      ],
    },
  },
  trilhas: {
    formacao: 'FORMAÇÃO',
    titulo: 'TRILHAS',
    instrucao: 'Conclua o Núcleo obrigatório para desbloquear as trilhas específicas.',
    paraTodos: 'Para todos',
    aulasConcluidasFracao: '{done}/{total} aulas concluídas',
    revisitar: 'REVISITAR',
    continuar: 'CONTINUAR',
    comecar: 'COMEÇAR',
    info: {
      nucleo: { publico: 'Para todos os criadores', duracao: '5 aulas' },
      yt: { publico: 'Criadores de vídeo', duracao: '3 aulas' },
      tt: { publico: 'Criadores de conteúdo vertical', duracao: '3 aulas' },
      ds: { publico: 'Designers e editores visuais', duracao: '3 aulas' },
      ed: { publico: 'Editores de vídeo', duracao: 'Em breve' },
    } as Record<string, { publico: string; duracao: string }>,
  },
  trilha: {
    tambemNoNucleo: 'também no núcleo',
    concluida: 'concluída',
    emAndamento: 'em andamento',
    seuProgresso: 'Seu progresso',
    trilha: 'TRILHA',
  },
  aula: {
    aula: 'AULA',
    video: 'VÍDEO',
    pdf: 'PDF',
    quiz: 'QUIZ',
    material: 'MATERIAL DE APOIO',
    baixado: 'baixado',
    materialDaAula: 'material da aula',
    baixar: 'BAIXAR',
    quizBloqueado: 'baixe o PDF para liberar',
    quizCorreto: 'respondido corretamente',
    quizErrado: 'Resposta incorreta. Revise o material e tente de novo.',
    tentarNovamente: 'TENTAR NOVAMENTE',
    quizEmBreve: 'Quiz em breve',
    marcarAssistido: 'MARCAR COMO ASSISTIDO',
    concluidaTitulo: 'AULA CONCLUÍDA',
    concluidaTexto: 'Progresso salvo. Siga para a próxima aula.',
    verTrilha: 'VER TRILHA',
    erroSalvar: 'Não foi possível salvar seu progresso. Tente novamente.',
    etapas: 'Etapas da aula',
    passoVideo: 'Assista ao vídeo',
    passoPdf: 'Baixe o material',
    passoQuiz: 'Acerte o quiz',
    proximaAula: 'PRÓXIMA AULA',
    comentarios: 'COMENTÁRIOS',
    comentario1: 'comentário',
    comentarioN: 'comentários',
    placeholder: 'Deixe sua dúvida ou comentário sobre esta aula...',
    respeito: 'Seja respeitoso e construtivo',
    enviar: 'ENVIAR',
    primeiro: 'Seja o primeiro a comentar nesta aula',
    voce: 'você',
    responder: 'responder',
    curtir: 'Curtir',
    agora: 'agora mesmo',
  },
  perfil: {
    minhaConta: 'MINHA CONTA',
    titulo: 'PERFIL',
    semNome: 'Sem nome',
    nome: 'NOME',
    nomePlaceholder: 'Seu nome completo',
    trocarFoto: 'Trocar foto',
    erroUpload: 'Não foi possível enviar a foto.',
    aulasConcluidas: 'AULAS CONCLUÍDAS',
    trilhasCompletas: 'TRILHAS COMPLETAS',
    certificados: 'CERTIFICADOS',
    progresso: 'PROGRESSO',
    nasTrilhas: 'NAS TRILHAS',
    nucleo: 'NÚCLEO',
    certInfo: 'Disponível ao concluir uma trilha específica. Emissão em até 15 dias após solicitação.',
    certVazio: 'Conclua uma trilha específica para solicitar seu certificado',
    trilhaConcluida: 'Trilha concluída',
    solicitar: 'SOLICITAR',
    solicitado: 'SOLICITADO',
    status: {
      pendente: 'Aguardando análise',
      em_analise: 'Em análise',
      aprovado: 'Aprovado ✓',
      rejeitado: 'Rejeitado',
    } as Record<string, string>,
    modal: {
      titulo: 'SOLICITAR CERTIFICADO',
      prazo: 'Prazo de emissão: até 15 dias úteis.',
      nomeCompleto: 'NOME COMPLETO',
      nomeCompletoPlaceholder: 'Como deve aparecer no certificado',
      emailReceber: 'E-MAIL PARA RECEBER',
      urgente: 'Preciso com urgência',
      urgenteDescricao: 'Para processo seletivo ou outra necessidade',
      motivo: 'MOTIVO',
      motivoPlaceholder: 'Ex: processo seletivo em 10/06...',
      erro: 'Não foi possível enviar a solicitação. Tente novamente.',
    },
  },
  sobre: {
    oProjeto: 'O PROJETO',
    titulo: 'SOBRE',
    missaoTitulo: 'CONHECIMENTO SEM PEDÁGIO',
    missao1:
      'A Escola Classe Creator existe porque acreditamos que entender o jogo das plataformas digitais não pode ser privilégio de quem pode pagar. Criadores, editores, designers e gestores de comunidade merecem acesso à mesma profundidade de análise que pesquisadores e grandes agências têm.',
    missao2: 'Tudo aqui é gratuito — os vídeos, os materiais, os quizzes, os certificados. Sempre foi, sempre será.',
    quem: 'QUEM ESTÁ POR TRÁS',
    filipeCargo: 'Pesquisador · Estrategista de Conteúdo · Criador',
    filipeBio:
      'Sou Filipe Severo — pesquisador, estrategista de conteúdo e criador há mais de 10 anos. Estudei plataformas digitais no mestrado e aprendi uma coisa que ninguém te conta: o jogo é mais complexo do que parece, e quem não entende as regras trabalha para quem entende. Criei a Escola Classe Creator porque acredito que esse conhecimento não pode ter pedágio.',
    movimento: 'O MOVIMENTO',
    movimentoTexto:
      'A Classe Creator é um movimento que reúne criadores, editores, roteiristas, designers e gestores de comunidade que querem trabalhar com liberdade e entender o sistema por dentro. Não é só um curso — é um espaço de pesquisa, análise crítica e articulação coletiva.',
    slogan: 'A revolução não cabe no feed.',
    site: 'Site',
    observatorio: 'OBSERVATÓRIO',
    raioxTexto1:
      'Ferramenta de auditoria algorítmica e pesquisa acadêmica do trabalho plataformizado no YouTube. Classifica artefatos segundo uma tipologia dupla — quem produz × que gênero de trabalho é produzido — ancorada em pesquisa acadêmica e operacionalizada por inteligência artificial.',
    raioxTexto2:
      'Mais do que um utilitário de análise, o Raio-X é uma proposta metodológica: tratar o YouTube não como vitrine de "criadores independentes", mas como regime de produção plataformizada.',
    raioxLema: '"Criar é trabalho."',
    raioxCta: 'ACESSAR O RAIO-X →',
    apoie: 'APOIE O PROJETO',
    ajudeTitulo: 'SE PUDER, AJUDE',
    ajudeTexto:
      'Manter a plataforma tem custo — servidores, domínio, tempo de desenvolvimento. Se este conteúdo te ajudou e você quiser contribuir, qualquer valor é bem-vindo. Mas nunca faça nada além das suas possibilidades. O conteúdo continuará gratuito independente disso.',
    pixTitulo: 'PIX — ESCANEIE OU COPIE A CHAVE',
    pixCopiar: 'Clique para copiar a chave PIX',
    obrigado: 'Obrigado por fazer parte dessa corrente.',
  },
  legal: {
    ultimaAtualizacao: 'Última atualização: setembro de 2026',
    avisoTraducao: '',
    termos: {
      titulo: 'TERMOS DE USO',
      secoes: [
        {
          titulo: '1. Aceitação dos termos',
          texto:
            'Ao acessar e utilizar a Escola Classe Creator, você concorda com estes Termos de Uso. Se não concordar com qualquer parte, não utilize a plataforma.',
        },
        {
          titulo: '2. Sobre a plataforma',
          texto:
            'A Escola Classe Creator é uma plataforma de formação gratuita para criadores de conteúdo, desenvolvida e mantida por Filipe Severo no âmbito do projeto Classe Creator. O acesso é gratuito e não há cobrança de nenhum tipo para uso da plataforma.',
        },
        {
          titulo: '3. Cadastro e conta',
          texto:
            'Para acessar o conteúdo, é necessário criar uma conta com e-mail e senha. Você é responsável pela segurança das suas credenciais. Não compartilhe sua senha com terceiros. Reservamo-nos o direito de encerrar contas que violem estes termos.',
        },
        {
          titulo: '4. Uso do conteúdo',
          texto:
            'Todo o conteúdo disponível na plataforma — vídeos, PDFs, textos e materiais — é de uso pessoal e não comercial. É proibida a reprodução, distribuição ou comercialização do conteúdo sem autorização expressa.',
        },
        {
          titulo: '5. Comentários e interações',
          texto:
            'Ao comentar nas aulas, você concorda em manter um ambiente respeitoso e construtivo. Comentários ofensivos, discriminatórios ou que violem direitos de terceiros poderão ser removidos e o usuário poderá ter sua conta suspensa.',
        },
        {
          titulo: '6. Certificados',
          texto:
            'Os certificados emitidos pela Escola Classe Creator são documentos de conclusão de trilhas formativas. A emissão está sujeita à conclusão de todas as etapas da trilha e à análise pela equipe da Classe Creator. Atualmente, os certificados não possuem reconhecimento pelo MEC.',
        },
        {
          titulo: '7. Disponibilidade',
          texto:
            'A plataforma é oferecida "como está". Não garantimos disponibilidade ininterrupta e não nos responsabilizamos por eventuais indisponibilidades técnicas.',
        },
        {
          titulo: '8. Alterações',
          texto:
            'Podemos atualizar estes termos a qualquer momento. Alterações significativas serão comunicadas pelo mural de avisos da plataforma.',
        },
        {
          titulo: '9. Contato',
          texto: 'Dúvidas sobre estes termos: acesse classecreator.com e entre em contato pela página de contato.',
        },
      ],
    },
    privacidade: {
      titulo: 'POLÍTICA DE PRIVACIDADE',
      secoes: [
        {
          titulo: '1. Quem somos',
          texto:
            'A Escola Classe Creator é uma plataforma de formação gratuita mantida por Filipe Severo, no âmbito do projeto Classe Creator. Esta política descreve como coletamos, usamos e protegemos seus dados, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).',
        },
        {
          titulo: '2. Dados que coletamos',
          texto:
            'Coletamos os seguintes dados ao criar sua conta e utilizar a plataforma: nome, endereço de e-mail, foto de perfil (opcional), progresso nas aulas e trilhas, comentários postados nas aulas e dados de solicitação de certificado (nome completo e e-mail para envio).',
        },
        {
          titulo: '3. Como usamos seus dados',
          texto:
            'Seus dados são usados exclusivamente para: permitir acesso à plataforma, salvar seu progresso de aprendizado, personalizar a experiência (nome e foto), emitir certificados de conclusão quando solicitado e comunicar atualizações importantes da plataforma.',
        },
        {
          titulo: '4. Compartilhamento de dados',
          texto:
            'Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins comerciais. Seus dados são armazenados no Supabase (infraestrutura de banco de dados) com servidores na região da América do Sul. O Supabase segue as melhores práticas de segurança e está em conformidade com regulamentações internacionais de proteção de dados.',
        },
        {
          titulo: '5. Seus direitos (LGPD)',
          texto:
            'Você tem direito a: acessar seus dados, corrigir dados incorretos, solicitar a exclusão da sua conta e dados, portabilidade dos seus dados e revogar consentimento a qualquer momento. Para exercer qualquer desses direitos, entre em contato pelo site classecreator.com.',
        },
        {
          titulo: '6. Cookies, verificação anti-bot e rastreamento',
          texto:
            'Utilizamos cookies estritamente necessários para manter sua sessão autenticada e lembrar o idioma escolhido. Nas telas de login, cadastro e recuperação de senha usamos o Cloudflare Turnstile para impedir cadastros automatizados; ele analisa sinais técnicos do navegador apenas para essa verificação. Não utilizamos cookies de rastreamento, publicidade ou análise de comportamento de terceiros.',
        },
        {
          titulo: '7. Retenção de dados',
          texto:
            'Seus dados são mantidos enquanto sua conta estiver ativa. Ao solicitar a exclusão da conta, seus dados pessoais serão removidos em até 30 dias, exceto onde a retenção for exigida por lei.',
        },
        {
          titulo: '8. Segurança',
          texto:
            'Adotamos medidas técnicas para proteger seus dados, incluindo autenticação segura, controle de acesso por Row Level Security (RLS) e armazenamento criptografado de senhas.',
        },
        {
          titulo: '9. Contato',
          texto:
            'Para questões sobre privacidade e proteção de dados: acesse classecreator.com e entre em contato pela página de contato.',
        },
      ],
    },
  },
  erros: {
    ops: 'ops',
    algoErrado: 'ALGO DEU ERRADO',
    algoErradoTexto: 'Ocorreu um erro inesperado. Tente novamente ou volte ao início.',
    tentarNovamente: 'TENTAR NOVAMENTE',
    inicio: 'INÍCIO',
    naoEncontrada: 'PÁGINA NÃO ENCONTRADA',
    naoEncontradaTexto: 'Esta página não existe ou foi movida.',
    voltarInicio: 'VOLTAR AO INÍCIO',
  },
}

export default pt

import type { Dictionary } from '../types'

const en: Dictionary = {
  meta: {
    title: 'Classe Creator School — Free training for creators',
    description:
      'Understand how digital platforms really work. Free training for content creators, editors, designers and community managers.',
    ogDescription: 'Understand how digital platforms really work. Free training for content creators.',
    twitterDescription: 'Free training for content creators. The revolution does not fit in the feed.',
    keywords: ['content creators', 'algorithm', 'digital platforms', 'free training', 'classe creator', 'creator economy'],
    sobre: 'About',
    termos: 'Terms of Use',
    privacidade: 'Privacy Policy',
  },
  comum: {
    escola: 'SCHOOL',
    usuario: 'User',
    criador: 'Creator',
    carregando: 'Loading...',
    aguarde: 'PLEASE WAIT...',
    voltar: 'BACK',
    cancelar: 'CANCEL',
    salvar: 'SAVE',
    fechar: 'Close',
    idioma: 'Language',
    aulas: 'lessons',
    gratuito: 'Free',
    emBreve: 'Coming soon',
    emBreveCaps: 'COMING SOON',
    bloqueada: 'Locked',
    nucleoObrigatorio: 'CORE TRACK',
    trilhasEspecificas: 'SPECIALIZED TRACKS',
    trilhaEspecifica: 'SPECIALIZED TRACK',
    concluaNucleo: 'finish the core track to unlock',
    aulasFracao: '{done}/{total} lessons',
  },
  nav: {
    inicio: 'HOME',
    trilhas: 'TRACKS',
    perfil: 'PROFILE',
    sobre: 'ABOUT',
    sair: 'LOG OUT',
  },
  login: {
    subtitulo: 'SCHOOL — FREE ACCESS',
    entrar: 'LOG IN',
    cadastrar: 'SIGN UP',
    criarConta: 'CREATE ACCOUNT',
    enviarEmail: 'SEND E-MAIL',
    redefinirSenha: 'RESET PASSWORD',
    redefinirInstrucao: "Enter your e-mail and we'll send you a link to reset your password.",
    google: 'Continue with Google',
    ou: 'OR',
    nome: 'NAME',
    nomePlaceholder: 'Your full name',
    email: 'E-MAIL',
    emailPlaceholder: 'you@email.com',
    senha: 'PASSWORD',
    esqueci: 'Forgot my password',
    voltarLogin: '← Back to log in',
    gratuito: '100% free. No catch.',
    aceiteAntes: 'By creating an account you agree to the',
    aceiteTermos: 'Terms of Use',
    aceiteE: 'and the',
    aceitePrivacidade: 'Privacy Policy',
    erroGoogle: 'Could not connect to Google.',
    erroOauth: 'Could not finish signing in with Google. Please try again.',
    erroCredenciais: 'Incorrect e-mail or password.',
    erroJaCadastrado:
      'This e-mail already has an account. Use "Forgot my password" below if you need to get in.',
    erroCadastro: 'Could not create your account. Please try again.',
    erroEnvioEmail: 'Could not send the e-mail. Please check the address.',
    erroConfig: 'Configuration error. Please try again.',
    erroCaptcha: "Please confirm you're not a robot before continuing.",
    erroCaptchaFalhou: 'The anti-bot check failed. Reload the page and try again.',
    sucessoCadastro: 'Account created! Check your inbox and confirm your e-mail before logging in.',
    heroTitulo: 'The revolution does not fit in the feed',
    heroTexto: 'Free training to understand how digital platforms really work — from the inside out.',
    heroItens: ['Tracks by area: YouTube, TikTok and Design', 'Video, PDF material and a quiz in every lesson', 'Free certificate when you finish a track'],
    tituloEntrar: 'Welcome back',
    tituloCadastro: 'Create your account',
    textoEntrar: 'Log in to continue your training.',
    textoCadastro: 'It takes less than a minute.',
    sucessoReset: 'Reset e-mail sent! Check your inbox.',
  },
  redefinir: {
    titulo: 'RESET PASSWORD',
    instrucao: 'Enter your new password below.',
    novaSenha: 'NEW PASSWORD',
    confirmar: 'CONFIRM PASSWORD',
    salvar: 'SAVE NEW PASSWORD',
    erroTamanho: 'Password must be at least 6 characters.',
    erroDiferentes: "Passwords don't match.",
    erroExpirado: 'Could not reset your password. The link may have expired.',
    sucessoTitulo: 'PASSWORD CHANGED!',
    sucessoTexto: 'Redirecting to your dashboard...',
  },
  dashboard: {
    bemVindo: 'WELCOME BACK',
    slogan: 'THE REVOLUTION DOES NOT FIT IN THE FEED',
    progressoGeral: 'OVERALL PROGRESS',
    aulasConcluidasDe: '{done} of {total} lessons completed',
    baseTodas: 'FOUNDATION FOR EVERY TRACK',
    mural: 'NOTICE BOARD',
    muralVazio: 'No notices right now.',
    ola: 'Hi, {nome}',
    continuar: 'Pick up where you left off',
    comecarJornada: 'Start your journey',
    ctaContinuar: 'CONTINUE LESSON',
    ctaComecar: 'START NOW',
    tudoConcluido: "You've completed every available lesson. New tracks are coming soon.",
    verTodas: 'See all',
    trilhaN: 'TRACK {n}',
    concluida: 'Completed',
    disponivel: 'Available',
    paraDesbloquear: 'TO UNLOCK',
    concluaO: 'Finish the',
    nucleoObrigatorio: 'Core Track',
    popup: {
      comoFunciona: 'HOW IT WORKS',
      titulo: 'CLASSE CREATOR SCHOOL',
      anterior: 'PREVIOUS',
      proximo: 'NEXT',
      comecar: 'START NOW',
      pular: 'skip intro',
      cards: [
        {
          titulo: 'Welcome to the School',
          texto:
            'Classe Creator School is free training for content creators. Here you will learn how platforms work from the inside out.',
        },
        {
          titulo: 'Core Track',
          texto:
            'Before any specialized track, you need to finish the Core. It has 5 lessons on algorithms, attention and platform logic — the foundation for everything.',
        },
        {
          titulo: 'Specialized Tracks',
          texto:
            'After the Core, you unlock tracks by area: YouTube, TikTok, Design and more. Each track has lessons, a PDF and a required quiz.',
        },
        {
          titulo: 'Step-by-step progress',
          texto:
            'Each lesson requires you to watch the video, download the PDF and pass the quiz. Only then is the next lesson unlocked. No shortcuts.',
        },
      ],
    },
  },
  trilhas: {
    formacao: 'TRAINING',
    titulo: 'TRACKS',
    instrucao: 'Finish the required Core Track to unlock the specialized tracks.',
    paraTodos: 'For everyone',
    aulasConcluidasFracao: '{done}/{total} lessons completed',
    revisitar: 'REVISIT',
    continuar: 'CONTINUE',
    comecar: 'START',
    info: {
      nucleo: { publico: 'For every creator', duracao: '5 lessons' },
      yt: { publico: 'Video creators', duracao: '3 lessons' },
      tt: { publico: 'Short-form vertical creators', duracao: '3 lessons' },
      ds: { publico: 'Designers and visual editors', duracao: '3 lessons' },
      ed: { publico: 'Video editors', duracao: 'Coming soon' },
    },
  },
  trilha: {
    tambemNoNucleo: 'also in the core',
    concluida: 'completed',
    emAndamento: 'in progress',
    seuProgresso: 'Your progress',
    trilha: 'TRACK',
  },
  aula: {
    aula: 'LESSON',
    video: 'VIDEO',
    pdf: 'PDF',
    quiz: 'QUIZ',
    material: 'SUPPORT MATERIAL',
    baixado: 'downloaded',
    materialDaAula: 'lesson material',
    baixar: 'DOWNLOAD',
    quizBloqueado: 'download the PDF to unlock',
    quizCorreto: 'answered correctly',
    quizErrado: 'Wrong answer. Review the material and try again.',
    tentarNovamente: 'TRY AGAIN',
    quizEmBreve: 'Quiz coming soon',
    marcarAssistido: 'MARK AS WATCHED',
    concluidaTitulo: 'LESSON COMPLETED',
    concluidaTexto: 'Progress saved. Move on to the next lesson.',
    verTrilha: 'VIEW TRACK',
    erroSalvar: 'Could not save your progress. Please try again.',
    etapas: 'Lesson steps',
    passoVideo: 'Watch the video',
    passoPdf: 'Download the material',
    passoQuiz: 'Pass the quiz',
    proximaAula: 'NEXT LESSON',
    comentarios: 'COMMENTS',
    comentario1: 'comment',
    comentarioN: 'comments',
    placeholder: 'Leave a question or comment about this lesson...',
    respeito: 'Be respectful and constructive',
    enviar: 'SEND',
    primeiro: 'Be the first to comment on this lesson',
    voce: 'you',
    responder: 'reply',
    curtir: 'Like',
    agora: 'just now',
  },
  perfil: {
    minhaConta: 'MY ACCOUNT',
    titulo: 'PROFILE',
    semNome: 'No name',
    nome: 'NAME',
    nomePlaceholder: 'Your full name',
    trocarFoto: 'Change photo',
    erroUpload: 'Could not upload the photo.',
    aulasConcluidas: 'LESSONS COMPLETED',
    trilhasCompletas: 'TRACKS COMPLETED',
    certificados: 'CERTIFICATES',
    progresso: 'TRACK',
    nasTrilhas: 'PROGRESS',
    nucleo: 'CORE',
    certInfo: 'Available when you finish a specialized track. Issued within 15 days of your request.',
    certVazio: 'Finish a specialized track to request your certificate',
    trilhaConcluida: 'Track completed',
    solicitar: 'REQUEST',
    solicitado: 'REQUESTED',
    status: {
      pendente: 'Awaiting review',
      em_analise: 'Under review',
      aprovado: 'Approved ✓',
      rejeitado: 'Rejected',
    },
    modal: {
      titulo: 'REQUEST CERTIFICATE',
      prazo: 'Issued within 15 business days.',
      nomeCompleto: 'FULL NAME',
      nomeCompletoPlaceholder: 'As it should appear on the certificate',
      emailReceber: 'E-MAIL TO RECEIVE IT',
      urgente: 'I need it urgently',
      urgenteDescricao: 'For a job application or another need',
      motivo: 'REASON',
      motivoPlaceholder: 'E.g. job application due June 10...',
      erro: 'Could not send your request. Please try again.',
    },
  },
  sobre: {
    oProjeto: 'THE PROJECT',
    titulo: 'ABOUT',
    missaoTitulo: 'KNOWLEDGE WITHOUT TOLLS',
    missao1:
      "Classe Creator School exists because we believe understanding how digital platforms work shouldn't be a privilege for those who can pay. Creators, editors, designers and community managers deserve the same depth of analysis that researchers and big agencies have.",
    missao2: 'Everything here is free — the videos, the materials, the quizzes, the certificates. It always was, and always will be.',
    quem: "WHO'S BEHIND IT",
    filipeCargo: 'Researcher · Content Strategist · Creator',
    filipeBio:
      "I'm Filipe Severo — a researcher, content strategist and creator for over 10 years. I studied digital platforms in my master's degree and learned something nobody tells you: the game is more complex than it looks, and whoever doesn't understand the rules works for those who do. I created Classe Creator School because I believe this knowledge shouldn't come with a toll.",
    movimento: 'THE MOVEMENT',
    movimentoTexto:
      "Classe Creator is a movement that brings together creators, editors, scriptwriters, designers and community managers who want to work freely and understand the system from the inside. It's not just a course — it's a space for research, critical analysis and collective organizing.",
    slogan: 'The revolution does not fit in the feed.',
    site: 'Website',
    observatorio: 'OBSERVATORY',
    raioxTexto1:
      'An algorithmic auditing and academic research tool for platformized labor on YouTube. It classifies content with a dual typology — who produces × what kind of work is produced — grounded in academic research and powered by artificial intelligence.',
    raioxTexto2:
      'More than an analytics utility, Raio-X is a methodological proposal: treating YouTube not as a showcase of "independent creators" but as a regime of platformized production.',
    raioxLema: '"Creating is work."',
    raioxCta: 'OPEN RAIO-X →',
    apoie: 'SUPPORT THE PROJECT',
    ajudeTitulo: 'IF YOU CAN, HELP OUT',
    ajudeTexto:
      "Running the platform costs money — servers, domain, development time. If this content helped you and you'd like to contribute, any amount is welcome. But never give more than you can afford. The content will stay free regardless.",
    pixTitulo: 'PIX (BRAZIL) — SCAN OR COPY THE KEY',
    pixCopiar: 'Click to copy the PIX key',
    obrigado: 'Thank you for being part of this.',
  },
  legal: {
    ultimaAtualizacao: 'Last updated: September 2026',
    avisoTraducao: 'This translation is provided for convenience. In case of any discrepancy, the Portuguese version prevails.',
    termos: {
      titulo: 'TERMS OF USE',
      secoes: [
        {
          titulo: '1. Acceptance of terms',
          texto:
            'By accessing and using Classe Creator School, you agree to these Terms of Use. If you do not agree with any part of them, do not use the platform.',
        },
        {
          titulo: '2. About the platform',
          texto:
            'Classe Creator School is a free training platform for content creators, developed and maintained by Filipe Severo as part of the Classe Creator project. Access is free and there is no charge of any kind to use the platform.',
        },
        {
          titulo: '3. Registration and account',
          texto:
            'To access the content, you must create an account with an e-mail and password. You are responsible for keeping your credentials secure. Do not share your password with anyone. We reserve the right to close accounts that violate these terms.',
        },
        {
          titulo: '4. Use of content',
          texto:
            'All content available on the platform — videos, PDFs, texts and materials — is for personal, non-commercial use. Reproducing, distributing or selling the content without express permission is prohibited.',
        },
        {
          titulo: '5. Comments and interactions',
          texto:
            'By commenting on lessons, you agree to keep the environment respectful and constructive. Offensive or discriminatory comments, or comments that violate the rights of others, may be removed and the user may have their account suspended.',
        },
        {
          titulo: '6. Certificates',
          texto:
            "Certificates issued by Classe Creator School are documents of completion of training tracks. Issuance depends on completing every step of the track and on review by the Classe Creator team. Certificates are currently not accredited by Brazil's Ministry of Education (MEC).",
        },
        {
          titulo: '7. Availability',
          texto:
            'The platform is offered "as is". We do not guarantee uninterrupted availability and are not responsible for any technical downtime.',
        },
        {
          titulo: '8. Changes',
          texto:
            "We may update these terms at any time. Significant changes will be announced on the platform's notice board.",
        },
        {
          titulo: '9. Contact',
          texto: 'Questions about these terms: visit classecreator.com and get in touch through the contact page.',
        },
      ],
    },
    privacidade: {
      titulo: 'PRIVACY POLICY',
      secoes: [
        {
          titulo: '1. Who we are',
          texto:
            "Classe Creator School is a free training platform maintained by Filipe Severo as part of the Classe Creator project. This policy describes how we collect, use and protect your data, in compliance with Brazil's General Data Protection Law (LGPD — Law No. 13,709/2018).",
        },
        {
          titulo: '2. Data we collect',
          texto:
            'We collect the following data when you create an account and use the platform: name, e-mail address, profile photo (optional), progress in lessons and tracks, comments posted on lessons and certificate request data (full name and delivery e-mail).',
        },
        {
          titulo: '3. How we use your data',
          texto:
            'Your data is used exclusively to: give you access to the platform, save your learning progress, personalize your experience (name and photo), issue completion certificates when requested and communicate important platform updates.',
        },
        {
          titulo: '4. Data sharing',
          texto:
            'We do not sell, rent or share your data with third parties for commercial purposes. Your data is stored on Supabase (database infrastructure) with servers in the South America region. Supabase follows security best practices and complies with international data protection regulations.',
        },
        {
          titulo: '5. Your rights (LGPD)',
          texto:
            'You have the right to: access your data, correct inaccurate data, request deletion of your account and data, data portability and withdraw consent at any time. To exercise any of these rights, get in touch through classecreator.com.',
        },
        {
          titulo: '6. Cookies, anti-bot verification and tracking',
          texto:
            'We use strictly necessary cookies to keep your session signed in and remember your chosen language. On the log in, sign up and password reset screens we use Cloudflare Turnstile to prevent automated sign-ups; it analyzes technical browser signals solely for that check. We do not use third-party tracking, advertising or behavioral analytics cookies.',
        },
        {
          titulo: '7. Data retention',
          texto:
            'Your data is kept while your account is active. When you request account deletion, your personal data will be removed within 30 days, except where retention is required by law.',
        },
        {
          titulo: '8. Security',
          texto:
            'We adopt technical measures to protect your data, including secure authentication, access control through Row Level Security (RLS) and encrypted password storage.',
        },
        {
          titulo: '9. Contact',
          texto:
            'For privacy and data protection questions: visit classecreator.com and get in touch through the contact page.',
        },
      ],
    },
  },
  landing: {
    metaTitulo: 'Classe Creator School — Free training for content creators',
    metaDescricao:
      'Understand how algorithms and platforms decide the reach of your work. Free tracks with video, PDF material, quizzes and a certificate.',
    nav: { comoFunciona: 'How it works', trilhas: 'Tracks', quem: "Who's behind it", faq: 'FAQ' },
    entrar: 'Log in',
    comecar: 'Start for free',
    irParaAulas: 'Go to my lessons',
    hero: {
      eyebrow: 'The Classe Creator School · free training',
      titulo: 'The industry teaches you to perform.',
      titulo2: 'The School teaches you to understand.',
      texto:
        'Free training on the platform ecosystem: how algorithms work, how platforms make money and how your work fits into all of it.',
      cta: 'START FOR FREE',
      ctaSecundario: "See what you'll learn",
      provas: ['100% free', 'Free certificate', 'At your own pace'],
      previaRotulo: 'First track',
      previaMeta: '5 lessons · Core track',
    },
    manifesto: {
      frase: "It's not a course to go viral.",
      frase2: "It's a place to think.",
      texto:
        "The School is Classe Creator's training front: free knowledge about how platforms really work, for people who want to understand the machine before working for it.",
    },
    como: {
      eyebrow: 'How it works',
      titulo: 'Three steps to your certificate',
      passos: [
        {
          titulo: 'Core track',
          texto: '5 lessons on platform logic, algorithms and attention. It is the foundation for everything — and unlocks the rest.',
        },
        {
          titulo: 'Tracks by area',
          texto: 'After the Core, pick your specialty: YouTube, TikTok, Design and, soon, Video editing.',
        },
        {
          titulo: 'Free certificate',
          texto: 'Finished a specialized track? Request your certificate from your profile, free of charge.',
        },
      ],
      aulaTitulo: 'Every lesson has three steps',
      aulaTexto: "The next lesson only unlocks when you finish all three. No shortcuts — that's how it sticks.",
      etapas: [
        { titulo: 'Video', texto: 'A straight-to-the-point lesson to watch whenever you want.' },
        { titulo: 'PDF material', texto: 'A summary to look up and review later.' },
        { titulo: 'Quiz', texto: "A question to lock in the lesson's key concept." },
      ],
    },
    trilhas: {
      eyebrow: "What you'll learn",
      titulo: 'School tracks',
      nucleoRotulo: 'Start here',
      nucleoTitulo: 'Understand the Game',
      nucleoTexto: 'The critical and strategic foundation every creator needs before any other track.',
      nucleoAulas: [
        'The logic of platforms',
        'What an algorithm is',
        'Attention as a scarce resource',
        'Platformized labor',
        'The interests behind product decisions',
      ],
      depois: 'After the Core, choose your area',
      lista: [
        { id: 'yt', titulo: 'YouTube Creator', texto: 'From the algorithm to the formats that hold an audience.', emBreve: false },
        { id: 'tt', titulo: 'TikTok Creator', texto: 'Distribution logic and creating for the vertical feed.', emBreve: false },
        { id: 'ds', titulo: 'Content Designer', texto: 'Visual fundamentals applied to digital creation.', emBreve: false },
        { id: 'ed', titulo: 'Video Editor', texto: 'A track dedicated to editors.', emBreve: true },
      ],
    },
    paraQuem: {
      eyebrow: "Who it's for",
      titulo: 'For those who create and those who think about platforms',
      texto: 'Platformized cultural workers and everyone who researches and lives in this world.',
      itens: ['Content creators', 'Editors', 'Scriptwriters', 'Designers', 'Community managers', 'Researchers', 'Journalists', 'Students'],
    },
    quem: {
      eyebrow: "Who's behind it",
      titulo: "Real research, in a creator's language",
      texto:
        "The school is created by Filipe Severo — a researcher, content strategist and creator for over 10 years, with a master's degree in Communication from PUCRS (Brazil) on platformized labor on YouTube.",
      movimento:
        'The School is one of the three fronts of Classe Creator — research, training and community —, a space for people who want to understand the system they create in, not just perform inside it. The research comes from the Observatory, which runs Raio-X.',
    },
    faq: {
      eyebrow: 'FAQ',
      titulo: 'Frequently asked questions',
      itens: [
        { p: 'Is it really free?', r: 'Yes. Videos, materials, quizzes and certificates are free. It always was, and always will be.' },
        {
          p: 'Do I have to pay for the certificate?',
          r: 'No. When you finish a specialized track, you request the certificate from your profile. It is issued within 15 days.',
        },
        {
          p: "Is the certificate accredited by Brazil's Ministry of Education (MEC)?",
          r: 'No. It is a certificate of completion of a training track issued by Classe Creator.',
        },
        { p: 'How long does it take?', r: 'You go at your own pace. Your progress is saved and you pick up where you left off.' },
        { p: 'What language are the lessons in?', r: 'The lessons are in Portuguese. The platform can be used in Portuguese, English or Spanish.' },
        { p: 'Do I need to be a creator already?', r: 'No. The School is for anyone who creates, edits, writes, researches or simply wants to better understand the system they work in.' },
      ],
    },
    final: {
      eyebrow: 'Classe only exists with you',
      titulo: "Start now. It's free.",
      texto: 'Create your account in under a minute and start with the Core.',
      cta: 'CREATE MY ACCOUNT',
    },
  },
  erros: {
    ops: 'oops',
    algoErrado: 'SOMETHING WENT WRONG',
    algoErradoTexto: 'An unexpected error occurred. Try again or go back home.',
    tentarNovamente: 'TRY AGAIN',
    inicio: 'HOME',
    naoEncontrada: 'PAGE NOT FOUND',
    naoEncontradaTexto: "This page doesn't exist or has been moved.",
    voltarInicio: 'BACK TO HOME',
  },
}

export default en

/**
 * Privacy policy and terms of use, in Portuguese, English and Spanish.
 * Who runs the site comes from the environment (LEGAL_NAME, LEGAL_NIF, LEGAL_ADDRESS,
 * LEGAL_EMAIL), so it can be filled in on Vercel once the business is registered.
 */

export type LegalBlock = string | string[]; // a paragraph, or a bullet list
export type LegalDoc = { title: string; updated: string; intro: string; sections: { title: string; body: LegalBlock[] }[] };

export function operator() {
  const name = process.env.LEGAL_NAME?.trim() || "Astrabela";
  const nif = process.env.LEGAL_NIF?.trim();
  const address = process.env.LEGAL_ADDRESS?.trim();
  const email = process.env.LEGAL_EMAIL?.trim() || "contacto@astrabela.com";
  return { name, nif, address, email };
}

function who() {
  const o = operator();
  return [o.name, o.nif && `NIF ${o.nif}`, o.address].filter(Boolean).join(", ");
}

import type { Locale } from "@/i18n/routing";

const PRICES = {
  pt: ["12,99 € por mês, com pagamento mensal;", "10,99 € por mês, com pagamento semestral;", "9,99 € por mês, com pagamento anual."],
  en: ["€12.99 a month, billed monthly;", "€10.99 a month, billed every 6 months;", "€9.99 a month, billed yearly."],
  es: ["12,99 € al mes, con pago mensual;", "10,99 € al mes, con pago semestral;", "9,99 € al mes, con pago anual."],
};

export function privacyPolicy(locale: Locale): LegalDoc {
  const o = operator();
  if (locale === "es") return privacyEs();
  if (locale === "en") {
    return {
      title: "Privacy policy",
      updated: "Last updated: 27 October 2026",
      intro:
        "Astrabela is a catalogue of beauty salons, barbershops and restaurants in Portugal and Spain, with online booking and client reviews of each professional. This policy explains what personal data we process, why, and what your rights are under the GDPR.",
      sections: [
        { title: "1. Who we are", body: [`The site astrabela.com is run by ${who()}. For any question about your data, write to ${o.email}.`] },
        {
          title: "2. What data we process",
          body: [
            "When you book or review (clients):",
            [
              "name, e-mail and phone number you give when booking, and the note you leave for the salon;",
              "the booking itself: salon, professional, service, date, time and status;",
              "your review: rating, text and the name you choose to show;",
              "if you create a client account: your name and e-mail, plus a password stored only as a secure hash, or, with Google, your Google account ID (we never see your Google password).",
            ],
            "When a salon or restaurant uses Astrabela (businesses):",
            [
              "the account holder's name and e-mail, and the password (stored only as an encrypted hash);",
              "business details: name, address, phone, e-mail, tax number (NIF), team, services, prices, opening hours, menu and social media links.",
            ],
            "Technical data: session cookies for signed-in accounts, a language cookie, and server logs (such as IP address and time of the request) kept for security.",
          ],
        },
        {
          title: "3. Why and on what legal basis",
          body: [
            [
              "to make, manage and remind you of a booking: performance of a contract (Art. 6(1)(b) GDPR);",
              "to run business accounts and subscriptions: performance of a contract;",
              "to publish reviews and prevent fake ones: our legitimate interest in a trustworthy catalogue (Art. 6(1)(f));",
              "to keep the site secure: legitimate interest;",
              "to meet tax and accounting rules: legal obligation (Art. 6(1)(c)).",
            ],
            "We do not sell personal data and we do not use it for advertising.",
          ],
        },
        {
          title: "4. The salon's role and ours",
          body: [
            "For bookings, the salon you choose decides how its client data is used and is the controller of that data. Astrabela processes it on the salon's behalf as a processor (Art. 28 GDPR), only to provide the service. For reviews, the public catalogue and the security of the site, Astrabela is the controller.",
          ],
        },
        {
          title: "5. Who receives the data",
          body: [
            "The salon or restaurant you book with. We also use these service providers, bound by data processing agreements:",
            [
              "Vercel Inc. – hosting; the site runs in Frankfurt (EU). Vercel is a US company, so any transfer outside the EU is covered by the EU Standard Contractual Clauses and the EU–US Data Privacy Framework;",
              "Neon – database, stored in Frankfurt (EU);",
              "Cloudflare – domain name service (DNS);",
              "Google – only if you choose to sign in with Google.",
            ],
          ],
        },
        {
          title: "6. How long we keep it",
          body: [
            [
              "client data and bookings: while the salon's account is active, and at most 2 years after your last visit;",
              "reviews: while the salon is listed on Astrabela;",
              "client accounts: until you delete them (button on the account page);",
              "business accounts: until the account is closed;",
              "invoices and billing records: 10 years, as Portuguese tax law requires;",
              "business login sessions: 30 days.",
            ],
          ],
        },
        {
          title: "7. Cookies",
          body: [
            "We only use cookies the site needs to work: ones that keep you signed in (and show your first name in the menu), short-lived ones during Google sign-in, one to remember your language, and one that remembers which dishes you liked on a restaurant menu (set only when you press ♥; it holds a random code, not your name). We do not use analytics or advertising cookies, so we do not ask for cookie consent.",
          ],
        },
        {
          title: "8. Your rights",
          body: [
            `You can ask us to access, correct or delete your data, to restrict or object to its processing, and to receive it in a portable format. Write to ${o.email}; we answer within one month. If the data was given to a salon, we will also pass your request on to it. You can also complain to the Portuguese data protection authority, CNPD (www.cnpd.pt), or to the data protection authority of the country where you live, such as the Spanish AEPD (www.aepd.es).`,
          ],
        },
        {
          title: "9. Security",
          body: [
            "The site is served only over HTTPS, passwords are stored encrypted, and booking and review links are personal and hard to guess. Do not share your personal link with others.",
          ],
        },
        {
          title: "10. Changes",
          body: ["If we change this policy, we will publish the new version here with its date. Important changes will be announced on the site."],
        },
      ],
    };
  }
  return {
    title: "Política de privacidade",
    updated: "Última atualização: 27 de outubro de 2026",
    intro:
      "A Astrabela é um catálogo de salões de beleza, barbearias e restaurantes em Portugal e Espanha, com marcação online e avaliações de clientes sobre cada profissional. Esta política explica que dados pessoais tratamos, para quê e quais são os seus direitos ao abrigo do RGPD.",
    sections: [
      { title: "1. Quem somos", body: [`O site astrabela.com é gerido por ${who()}. Para qualquer questão sobre os seus dados, escreva para ${o.email}.`] },
      {
        title: "2. Que dados tratamos",
        body: [
          "Quando faz uma marcação ou uma avaliação (clientes):",
          [
            "nome, e-mail e telemóvel que indica na marcação, e a nota que deixa ao salão;",
            "a própria marcação: salão, profissional, serviço, data, hora e estado;",
            "a sua avaliação: nota, texto e o nome que escolhe mostrar;",
            "se criar uma conta de cliente: nome e e-mail, e uma palavra-passe guardada apenas em forma cifrada (hash) ou, com Google, o identificador da conta Google (nunca vemos a sua palavra-passe Google).",
          ],
          "Quando um salão ou restaurante usa a Astrabela (empresas):",
          [
            "nome e e-mail do titular da conta, e a palavra-passe (guardada apenas cifrada);",
            "dados do negócio: nome, morada, telefone, e-mail, NIF, equipa, serviços, preços, horários, menu e ligações às redes sociais.",
          ],
          "Dados técnicos: cookies de sessão para contas com sessão iniciada, um cookie de idioma e registos do servidor (como endereço IP e hora do pedido), guardados por segurança.",
        ],
      },
      {
        title: "3. Para quê e com que fundamento",
        body: [
          [
            "fazer, gerir e lembrar a marcação: execução de contrato (art. 6.º, n.º 1, al. b) do RGPD);",
            "gerir contas e subscrições das empresas: execução de contrato;",
            "publicar avaliações e impedir avaliações falsas: interesse legítimo num catálogo de confiança (art. 6.º, n.º 1, al. f));",
            "manter o site seguro: interesse legítimo;",
            "cumprir obrigações fiscais e contabilísticas: obrigação legal (art. 6.º, n.º 1, al. c)).",
          ],
          "Não vendemos dados pessoais nem os usamos para publicidade.",
        ],
      },
      {
        title: "4. O papel do salão e o nosso",
        body: [
          "Nas marcações, o salão que escolhe decide como usa os dados dos seus clientes e é o responsável pelo tratamento desses dados. A Astrabela trata-os por conta do salão, como subcontratante (art. 28.º do RGPD), apenas para prestar o serviço. Nas avaliações, no catálogo público e na segurança do site, a Astrabela é a responsável pelo tratamento.",
        ],
      },
      {
        title: "5. Quem recebe os dados",
        body: [
          "O salão ou restaurante onde faz a marcação. Usamos também estes prestadores de serviços, vinculados por acordos de tratamento de dados:",
          [
            "Vercel Inc. – alojamento; o site funciona em Frankfurt (UE). A Vercel é uma empresa dos EUA, por isso qualquer transferência para fora da UE está coberta pelas Cláusulas Contratuais-Tipo da UE e pelo Quadro de Privacidade de Dados UE-EUA;",
            "Neon – base de dados, guardada em Frankfurt (UE);",
            "Cloudflare – serviço de nomes de domínio (DNS);",
            "Google – apenas se escolher entrar com Google.",
          ],
        ],
      },
      {
        title: "6. Durante quanto tempo",
        body: [
          [
            "dados de clientes e marcações: enquanto a conta do salão estiver ativa e, no máximo, 2 anos após a sua última visita;",
            "avaliações: enquanto o salão estiver na Astrabela;",
            "contas de cliente: até as apagar (botão na página da conta);",
            "contas de empresa: até ao encerramento da conta;",
            "faturas e registos de faturação: 10 anos, como exige a lei fiscal portuguesa;",
            "sessões de acesso das empresas: 30 dias.",
          ],
        ],
      },
      {
        title: "7. Cookies",
        body: [
          "Usamos apenas os cookies necessários ao funcionamento do site: os que mantêm a sessão iniciada (e mostram o seu primeiro nome no menu), outros de curta duração durante o início de sessão com a Google, um para lembrar o idioma e um que lembra os pratos de que gostou num menu de restaurante (criado só quando carrega em ♥; contém um código aleatório, não o seu nome). Não usamos cookies de análise nem de publicidade, por isso não pedimos consentimento para cookies.",
        ],
      },
      {
        title: "8. Os seus direitos",
        body: [
          `Pode pedir acesso, retificação ou apagamento dos seus dados, a limitação ou oposição ao tratamento, e recebê-los num formato portável. Escreva para ${o.email}; respondemos no prazo de um mês. Se os dados foram dados a um salão, encaminhamos-lhe também o seu pedido. Pode ainda apresentar queixa à Comissão Nacional de Proteção de Dados, CNPD (www.cnpd.pt), ou à autoridade de proteção de dados do país onde vive, como a AEPD em Espanha (www.aepd.es).`,
        ],
      },
      {
        title: "9. Segurança",
        body: [
          "O site funciona apenas com HTTPS, as palavras-passe são guardadas cifradas e os links de marcação e de avaliação são pessoais e difíceis de adivinhar. Não partilhe o seu link pessoal com outras pessoas.",
        ],
      },
      {
        title: "10. Alterações",
        body: ["Se alterarmos esta política, publicamos aqui a nova versão com a respetiva data. As alterações importantes serão anunciadas no site."],
      },
    ],
  };
}

export function termsOfUse(locale: Locale): LegalDoc {
  const o = operator();
  if (locale === "es") return termsEs();
  if (locale === "en") {
    return {
      title: "Terms of use",
      updated: "Last updated: 27 October 2026",
      intro: `These terms govern the use of astrabela.com, run by ${who()}. By using the site or creating a business account you accept them.`,
      sections: [
        {
          title: "1. The service",
          body: [
            "Astrabela lets clients find beauty salons, barbershops and restaurants, book appointments online, review the professionals and see restaurant menus. Salons and restaurants manage their profile, team, services, calendar and menu in their business account.",
          ],
        },
        {
          title: "2. For clients",
          body: [
            [
              "Using Astrabela is free and needs no account.",
              "A booking is an agreement between you and the salon. Services, prices and duration are set by the salon, and the service is provided by the salon, not by Astrabela.",
              "Astrabela does not take payments: you pay the salon directly.",
              "You can cancel through the personal link you receive. Please cancel if you cannot come.",
            ],
          ],
        },
        {
          title: "3. Reviews",
          body: [
            "Any client signed in to an Astrabela account can review a professional of a salon, once every 30 days per professional. Clients with a visit booked through Astrabela or confirmed by the salon can also review through their personal link, and those reviews carry a confirmed-visit label. A review must:",
            [
              "describe your own real experience;",
              "contain no insults, threats or discrimination;",
              "contain no personal data of other people, and no advertising or links.",
            ],
            "We may hide reviews that break these rules. The salon cannot delete or edit reviews; it can reply publicly or report a review to our moderation.",
          ],
        },
        {
          title: "4. For salons and restaurants",
          body: [
            [
              "The information in your profile, prices and menu must be true and kept up to date. You are responsible for it and for the services you provide.",
              "Keep your password secret; you are responsible for activity in your account.",
              "Do not create fake bookings, reviews or invitations, and do not ask for reviews in exchange for rewards.",
              "Only listings with an active subscription or free period appear in search.",
            ],
          ],
        },
        {
          title: "5. Prices",
          body: [
            "For salons, barbershops and restaurants the first 3 months are free and no card is needed to start. After that, staying listed needs a subscription:",
            PRICES.en,
            "Payment terms are shown before any charge. We may change prices with at least 30 days' notice; the change applies from your next billing period.",
          ],
        },
        {
          title: "6. Data processing agreement (businesses)",
          body: [
            "For client data in bookings, the business is the controller and Astrabela is its processor (Art. 28 GDPR). Astrabela:",
            [
              "processes this data only to provide the service and on the business's instructions given through the site;",
              "keeps it confidential and protected with appropriate security measures;",
              "uses only the sub-processors listed in the privacy policy and informs businesses before adding new ones;",
              "helps the business answer clients' requests and report data breaches;",
              "deletes or returns the data when the account is closed, except what the law requires us to keep.",
            ],
          ],
        },
        {
          title: "7. Suspension and closing an account",
          body: [
            "You can close your business account at any time by writing to us. We may suspend or remove a listing that breaks these terms, the law or the rights of others, and we will explain why.",
          ],
        },
        {
          title: "8. Liability",
          body: [
            "We work to keep the site available and correct, but we cannot guarantee it is always free of interruptions or errors. Astrabela is not a party to the agreement between client and salon and is not liable for the services provided by salons. Nothing in these terms limits the rights consumers have under the law.",
          ],
        },
        {
          title: "9. Law and complaints",
          body: [
            `These terms are governed by Portuguese law. For any complaint write to ${o.email}. Consumers may also use the electronic complaints book (www.livroreclamacoes.pt) and, in a dispute, an alternative dispute resolution entity such as CNIACC (www.cniacc.pt). Consumers living in another EU country keep the protection of the law of that country and may turn to its consumer bodies.`,
          ],
        },
        {
          title: "10. Changes",
          body: ["We may update these terms. The new version is published here with its date; businesses will be told about important changes in advance."],
        },
      ],
    };
  }
  return {
    title: "Termos de utilização",
    updated: "Última atualização: 27 de outubro de 2026",
    intro: `Estes termos regulam a utilização de astrabela.com, gerido por ${who()}. Ao usar o site ou ao criar uma conta de empresa, aceita-os.`,
    sections: [
      {
        title: "1. O serviço",
        body: [
          "A Astrabela permite aos clientes encontrar salões de beleza, barbearias e restaurantes, marcar serviços online, avaliar os profissionais e consultar menus de restaurantes. Os salões e restaurantes gerem o perfil, a equipa, os serviços, a agenda e o menu na sua conta de empresa.",
        ],
      },
      {
        title: "2. Para clientes",
        body: [
          [
            "Usar a Astrabela é gratuito e não precisa de conta.",
            "A marcação é um acordo entre si e o salão. Os serviços, preços e duração são definidos pelo salão, e o serviço é prestado pelo salão, não pela Astrabela.",
            "A Astrabela não recebe pagamentos: paga diretamente ao salão.",
            "Pode cancelar através do link pessoal que recebe. Cancele, por favor, se não puder comparecer.",
          ],
        ],
      },
      {
        title: "3. Avaliações",
        body: [
          "Qualquer cliente com sessão iniciada numa conta Astrabela pode avaliar um profissional de um salão, uma vez a cada 30 dias por profissional. Os clientes com uma visita marcada pela Astrabela ou confirmada pelo salão também podem avaliar através do seu link pessoal, e essas avaliações têm a marca de visita confirmada. Uma avaliação deve:",
          [
            "descrever a sua própria experiência real;",
            "não conter insultos, ameaças nem discriminação;",
            "não conter dados pessoais de outras pessoas, publicidade ou links.",
          ],
          "Podemos ocultar avaliações que violem estas regras. O salão não pode apagar nem editar avaliações; pode responder publicamente ou denunciar uma avaliação à moderação.",
        ],
      },
      {
        title: "4. Para salões e restaurantes",
        body: [
          [
            "A informação do perfil, os preços e o menu devem ser verdadeiros e estar atualizados. É responsável por eles e pelos serviços que presta.",
            "Mantenha a palavra-passe em segredo; é responsável pela atividade na sua conta.",
            "Não crie marcações, avaliações ou pedidos de avaliação falsos, nem peça avaliações em troca de recompensas.",
            "Só aparecem na pesquisa os perfis com subscrição ativa ou período gratuito.",
          ],
        ],
      },
      {
        title: "5. Preços",
        body: [
          "Para salões, barbearias e restaurantes, os primeiros 3 meses são grátis e não é preciso cartão para começar. Depois, para continuar visível é necessária uma subscrição:",
          PRICES.pt,
          "As condições de pagamento são apresentadas antes de qualquer cobrança. Podemos alterar os preços com pelo menos 30 dias de aviso; a alteração aplica-se a partir do período de faturação seguinte.",
        ],
      },
      {
        title: "6. Acordo de tratamento de dados (empresas)",
        body: [
          "Quanto aos dados dos clientes nas marcações, a empresa é a responsável pelo tratamento e a Astrabela é a sua subcontratante (art. 28.º do RGPD). A Astrabela:",
          [
            "trata estes dados apenas para prestar o serviço e segundo as instruções que a empresa dá através do site;",
            "mantém-nos confidenciais e protegidos com medidas de segurança adequadas;",
            "usa apenas os subcontratantes indicados na política de privacidade e informa as empresas antes de acrescentar outros;",
            "ajuda a empresa a responder aos pedidos dos clientes e a comunicar violações de dados;",
            "apaga ou devolve os dados quando a conta é encerrada, exceto o que a lei nos obrigue a guardar.",
          ],
        ],
      },
      {
        title: "7. Suspensão e encerramento da conta",
        body: [
          "Pode encerrar a sua conta de empresa a qualquer momento, escrevendo-nos. Podemos suspender ou retirar um perfil que viole estes termos, a lei ou os direitos de terceiros, explicando o motivo.",
        ],
      },
      {
        title: "8. Responsabilidade",
        body: [
          "Esforçamo-nos por manter o site disponível e correto, mas não podemos garantir que funcione sempre sem interrupções ou erros. A Astrabela não é parte no acordo entre cliente e salão e não responde pelos serviços prestados pelos salões. Nada nestes termos limita os direitos que a lei garante aos consumidores.",
        ],
      },
      {
        title: "9. Lei aplicável e reclamações",
        body: [
          `Estes termos regem-se pela lei portuguesa. Para qualquer reclamação, escreva para ${o.email}. Os consumidores podem também usar o Livro de Reclamações Eletrónico (www.livroreclamacoes.pt) e, em caso de litígio, recorrer a uma entidade de resolução alternativa de litígios, como o CNIACC (www.cniacc.pt). Os consumidores que vivem noutro país da UE mantêm a proteção da lei desse país e podem recorrer aos seus organismos de consumo.`,
        ],
      },
      {
        title: "10. Alterações",
        body: ["Podemos atualizar estes termos. A nova versão é publicada aqui com a respetiva data; as empresas serão avisadas com antecedência das alterações importantes."],
      },
    ],
  };
}

function privacyEs(): LegalDoc {
  const o = operator();
  return {
    title: "Política de privacidad",
    updated: "Última actualización: 27 de octubre de 2026",
    intro:
      "Astrabela es un catálogo de salones de belleza, barberías y restaurantes en España y Portugal, con reserva online y valoraciones de clientes sobre cada profesional. Esta política explica qué datos personales tratamos, para qué y cuáles son tus derechos según el RGPD.",
    sections: [
      { title: "1. Quiénes somos", body: [`El sitio astrabela.com lo gestiona ${who()}. Para cualquier cuestión sobre tus datos, escribe a ${o.email}.`] },
      {
        title: "2. Qué datos tratamos",
        body: [
          "Cuando reservas o valoras (clientes):",
          [
            "el nombre, el e-mail y el móvil que indicas al reservar, y la nota que dejas al salón;",
            "la propia reserva: salón, profesional, servicio, fecha, hora y estado;",
            "tu valoración: nota, texto y el nombre que eliges mostrar;",
            "si creas una cuenta de cliente: nombre y e-mail, y una contraseña guardada solo de forma cifrada (hash) o, con Google, el identificador de tu cuenta de Google (nunca vemos tu contraseña de Google).",
          ],
          "Cuando un salón o restaurante usa Astrabela (empresas):",
          [
            "el nombre y el e-mail del titular de la cuenta, y la contraseña (guardada solo cifrada);",
            "datos del negocio: nombre, dirección, teléfono, e-mail, NIF, equipo, servicios, precios, horarios, carta y enlaces a redes sociales.",
          ],
          "Datos técnicos: cookies de sesión para cuentas con la sesión iniciada, una cookie de idioma y registros del servidor (como la dirección IP y la hora de la petición), guardados por seguridad.",
        ],
      },
      {
        title: "3. Para qué y con qué base legal",
        body: [
          [
            "hacer, gestionar y recordar la reserva: ejecución de un contrato (art. 6.1.b del RGPD);",
            "gestionar las cuentas y suscripciones de las empresas: ejecución de un contrato;",
            "publicar valoraciones e impedir las falsas: interés legítimo en un catálogo de confianza (art. 6.1.f);",
            "mantener el sitio seguro: interés legítimo;",
            "cumplir obligaciones fiscales y contables: obligación legal (art. 6.1.c).",
          ],
          "No vendemos datos personales ni los usamos para publicidad.",
        ],
      },
      {
        title: "4. El papel del salón y el nuestro",
        body: [
          "En las reservas, el salón que eliges decide cómo usa los datos de sus clientes y es el responsable del tratamiento de esos datos. Astrabela los trata por cuenta del salón, como encargado del tratamiento (art. 28 del RGPD), solo para prestar el servicio. En las valoraciones, el catálogo público y la seguridad del sitio, Astrabela es la responsable del tratamiento.",
        ],
      },
      {
        title: "5. Quién recibe los datos",
        body: [
          "El salón o restaurante donde reservas. También usamos estos proveedores de servicios, vinculados por acuerdos de tratamiento de datos:",
          [
            "Vercel Inc. – alojamiento; el sitio funciona en Fráncfort (UE). Vercel es una empresa de EE. UU., por lo que cualquier transferencia fuera de la UE está cubierta por las Cláusulas Contractuales Tipo de la UE y por el Marco de Privacidad de Datos UE-EE. UU.;",
            "Neon – base de datos, guardada en Fráncfort (UE);",
            "Cloudflare – servicio de nombres de dominio (DNS);",
            "Google – solo si eliges entrar con Google.",
          ],
        ],
      },
      {
        title: "6. Durante cuánto tiempo",
        body: [
          [
            "datos de clientes y reservas: mientras la cuenta del salón esté activa y, como máximo, 2 años después de tu última visita;",
            "valoraciones: mientras el salón esté en Astrabela;",
            "cuentas de cliente: hasta que las borres (botón en la página de la cuenta);",
            "cuentas de empresa: hasta el cierre de la cuenta;",
            "facturas y registros de facturación: 10 años, como exige la ley fiscal portuguesa;",
            "sesiones de acceso de las empresas: 30 días.",
          ],
        ],
      },
      {
        title: "7. Cookies",
        body: [
          "Solo usamos las cookies necesarias para que el sitio funcione: las que mantienen la sesión iniciada (y muestran tu nombre en el menú), otras de corta duración durante el inicio de sesión con Google, una para recordar el idioma y una que recuerda los platos que te han gustado en la carta de un restaurante (se crea solo cuando pulsas ♥; contiene un código aleatorio, no tu nombre). No usamos cookies de análisis ni de publicidad, por eso no pedimos consentimiento para las cookies.",
        ],
      },
      {
        title: "8. Tus derechos",
        body: [
          `Puedes pedir el acceso, la rectificación o la supresión de tus datos, la limitación u oposición al tratamiento, y recibirlos en un formato portable. Escribe a ${o.email}; respondemos en el plazo de un mes. Si los datos se dieron a un salón, también le trasladamos tu petición. Puedes además presentar una reclamación ante la Agencia Española de Protección de Datos, AEPD (www.aepd.es), o ante la autoridad portuguesa, CNPD (www.cnpd.pt).`,
        ],
      },
      {
        title: "9. Seguridad",
        body: [
          "El sitio funciona solo con HTTPS, las contraseñas se guardan cifradas y los enlaces de reserva y de valoración son personales y difíciles de adivinar. No compartas tu enlace personal con otras personas.",
        ],
      },
      {
        title: "10. Cambios",
        body: ["Si cambiamos esta política, publicaremos aquí la nueva versión con su fecha. Los cambios importantes se anunciarán en el sitio."],
      },
    ],
  };
}

function termsEs(): LegalDoc {
  const o = operator();
  return {
    title: "Términos de uso",
    updated: "Última actualización: 27 de octubre de 2026",
    intro: `Estos términos regulan el uso de astrabela.com, gestionado por ${who()}. Al usar el sitio o crear una cuenta de empresa, los aceptas.`,
    sections: [
      {
        title: "1. El servicio",
        body: [
          "Astrabela permite a los clientes encontrar salones de belleza, barberías y restaurantes, reservar servicios online, valorar a los profesionales y consultar cartas de restaurantes. Los salones y restaurantes gestionan el perfil, el equipo, los servicios, la agenda y la carta en su cuenta de empresa.",
        ],
      },
      {
        title: "2. Para clientes",
        body: [
          [
            "Usar Astrabela es gratis y no necesita cuenta.",
            "La reserva es un acuerdo entre tú y el salón. Los servicios, precios y duración los fija el salón, y el servicio lo presta el salón, no Astrabela.",
            "Astrabela no cobra pagos: pagas directamente al salón.",
            "Puedes cancelar con el enlace personal que recibes. Por favor, cancela si no puedes venir.",
          ],
        ],
      },
      {
        title: "3. Valoraciones",
        body: [
          "Cualquier cliente con la sesión iniciada en una cuenta de Astrabela puede valorar a un profesional de un salón, una vez cada 30 días por profesional. Los clientes con una visita reservada por Astrabela o confirmada por el salón también pueden valorar con su enlace personal, y esas valoraciones llevan la marca de visita confirmada. Una valoración debe:",
          [
            "describir tu propia experiencia real;",
            "no contener insultos, amenazas ni discriminación;",
            "no contener datos personales de otras personas, publicidad ni enlaces.",
          ],
          "Podemos ocultar las valoraciones que incumplan estas reglas. El salón no puede borrar ni editar valoraciones; puede responder públicamente o denunciar una valoración a moderación.",
        ],
      },
      {
        title: "4. Para salones y restaurantes",
        body: [
          [
            "La información del perfil, los precios y la carta deben ser veraces y estar actualizados. Eres responsable de ellos y de los servicios que prestas.",
            "Mantén la contraseña en secreto; eres responsable de la actividad en tu cuenta.",
            "No crees reservas, valoraciones ni peticiones de valoración falsas, ni pidas valoraciones a cambio de recompensas.",
            "Solo aparecen en la búsqueda los perfiles con suscripción activa o periodo gratuito.",
          ],
        ],
      },
      {
        title: "5. Precios",
        body: [
          "Para salones, barberías y restaurantes los 3 primeros meses son gratis y no hace falta tarjeta para empezar. Después, para seguir visible se necesita una suscripción:",
          PRICES.es,
          "Las condiciones de pago se muestran antes de cualquier cobro. Podemos cambiar los precios con al menos 30 días de aviso; el cambio se aplica desde el siguiente periodo de facturación.",
        ],
      },
      {
        title: "6. Acuerdo de tratamiento de datos (empresas)",
        body: [
          "En cuanto a los datos de los clientes en las reservas, la empresa es la responsable del tratamiento y Astrabela es su encargada (art. 28 del RGPD). Astrabela:",
          [
            "trata estos datos solo para prestar el servicio y según las instrucciones que la empresa da a través del sitio;",
            "los mantiene confidenciales y protegidos con medidas de seguridad adecuadas;",
            "usa solo los subencargados indicados en la política de privacidad e informa a las empresas antes de añadir otros;",
            "ayuda a la empresa a responder a las peticiones de los clientes y a notificar brechas de datos;",
            "borra o devuelve los datos cuando se cierra la cuenta, salvo lo que la ley nos obligue a guardar.",
          ],
        ],
      },
      {
        title: "7. Suspensión y cierre de la cuenta",
        body: [
          "Puedes cerrar tu cuenta de empresa en cualquier momento escribiéndonos. Podemos suspender o retirar un perfil que incumpla estos términos, la ley o los derechos de terceros, explicando el motivo.",
        ],
      },
      {
        title: "8. Responsabilidad",
        body: [
          "Nos esforzamos por mantener el sitio disponible y correcto, pero no podemos garantizar que funcione siempre sin interrupciones ni errores. Astrabela no es parte del acuerdo entre cliente y salón y no responde de los servicios que prestan los salones. Nada en estos términos limita los derechos que la ley reconoce a los consumidores.",
        ],
      },
      {
        title: "9. Ley aplicable y reclamaciones",
        body: [
          `Estos términos se rigen por la ley portuguesa, sin perjuicio de la protección que te da la ley de tu país de residencia como consumidor. Para cualquier reclamación, escribe a ${o.email}. Los consumidores residentes en España pueden acudir también a los servicios de consumo de su comunidad autónoma y, en caso de litigio, a una entidad de resolución alternativa de litigios o a las Juntas Arbitrales de Consumo.`,
        ],
      },
      {
        title: "10. Cambios",
        body: ["Podemos actualizar estos términos. La nueva versión se publica aquí con su fecha; avisaremos con antelación a las empresas de los cambios importantes."],
      },
    ],
  };
}

/**
 * Privacy policy and terms of use, in Portuguese, English, Spanish, French, Italian and German.
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
  fr: ["12,99 € par mois, en paiement mensuel ;", "10,99 € par mois, en paiement semestriel ;", "9,99 € par mois, en paiement annuel."],
  it: ["12,99 € al mese, con pagamento mensile;", "10,99 € al mese, con pagamento semestrale;", "9,99 € al mese, con pagamento annuale."],
  de: ["12,99 € pro Monat bei monatlicher Zahlung;", "10,99 € pro Monat bei halbjährlicher Zahlung;", "9,99 € pro Monat bei jährlicher Zahlung."],
  nl: ["€ 12,99 per maand bij maandelijkse betaling;", "€ 10,99 per maand bij halfjaarlijkse betaling;", "€ 9,99 per maand bij jaarlijkse betaling."],
};

export function privacyPolicy(locale: Locale): LegalDoc {
  const o = operator();
  if (locale === "es") return privacyEs();
  if (locale === "fr") return privacyFr();
  if (locale === "it") return privacyIt();
  if (locale === "de") return privacyDe();
  if (locale === "nl") return privacyNl();
  if (locale === "en") {
    return {
      title: "Privacy policy",
      updated: "Last updated: 28 October 2026",
      intro:
        "Astrabela is a catalogue of beauty salons, barbershops and restaurants in the European Union, with online booking and client reviews of each professional. This policy explains what personal data we process, why, and what your rights are under the GDPR.",
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
            `You can ask us to access, correct or delete your data, to restrict or object to its processing, and to receive it in a portable format. Write to ${o.email}; we answer within one month. If the data was given to a salon, we will also pass your request on to it. You can also complain to the Portuguese data protection authority, CNPD (www.cnpd.pt), or to the data protection authority of the country where you live, such as the Spanish AEPD (www.aepd.es), the French CNIL (www.cnil.fr) or the Italian Garante (www.garanteprivacy.it).`,
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
    updated: "Última atualização: 28 de outubro de 2026",
    intro:
      "A Astrabela é um catálogo de salões de beleza, barbearias e restaurantes na União Europeia, com marcação online e avaliações de clientes sobre cada profissional. Esta política explica que dados pessoais tratamos, para quê e quais são os seus direitos ao abrigo do RGPD.",
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
          `Pode pedir acesso, retificação ou apagamento dos seus dados, a limitação ou oposição ao tratamento, e recebê-los num formato portável. Escreva para ${o.email}; respondemos no prazo de um mês. Se os dados foram dados a um salão, encaminhamos-lhe também o seu pedido. Pode ainda apresentar queixa à Comissão Nacional de Proteção de Dados, CNPD (www.cnpd.pt), ou à autoridade de proteção de dados do país onde vive, como a AEPD em Espanha (www.aepd.es), a CNIL em França (www.cnil.fr) ou o Garante em Itália (www.garanteprivacy.it).`,
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
  if (locale === "fr") return termsFr();
  if (locale === "it") return termsIt();
  if (locale === "de") return termsDe();
  if (locale === "nl") return termsNl();
  if (locale === "en") {
    return {
      title: "Terms of use",
      updated: "Last updated: 28 October 2026",
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
    updated: "Última atualização: 28 de outubro de 2026",
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
    updated: "Última actualización: 28 de octubre de 2026",
    intro:
      "Astrabela es un catálogo de salones de belleza, barberías y restaurantes en la Unión Europea, con reserva online y valoraciones de clientes sobre cada profesional. Esta política explica qué datos personales tratamos, para qué y cuáles son tus derechos según el RGPD.",
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
    updated: "Última actualización: 28 de octubre de 2026",
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

function privacyFr(): LegalDoc {
  const o = operator();
  return {
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : 28 octobre 2026",
    intro:
      "Astrabela est un catalogue de salons de beauté, de barbiers et de restaurants dans l'Union européenne, avec réservation en ligne et avis clients sur chaque professionnel. Cette politique explique quelles données personnelles nous traitons, pourquoi, et quels sont vos droits au titre du RGPD.",
    sections: [
      { title: "1. Qui sommes-nous", body: [`Le site astrabela.com est exploité par ${who()}. Pour toute question sur vos données, écrivez à ${o.email}.`] },
      {
        title: "2. Les données que nous traitons",
        body: [
          "Quand vous réservez ou laissez un avis (clients) :",
          [
            "le nom, l'e-mail et le numéro de portable indiqués lors de la réservation, et le message laissé au salon ;",
            "la réservation elle-même : salon, professionnel, prestation, date, heure et statut ;",
            "votre avis : note, texte et nom que vous choisissez d'afficher ;",
            "si vous créez un compte client : nom et e-mail, et un mot de passe conservé uniquement sous forme chiffrée (hachée) ou, avec Google, l'identifiant de votre compte Google (nous ne voyons jamais votre mot de passe Google).",
          ],
          "Quand un salon ou un restaurant utilise Astrabela (professionnels) :",
          [
            "le nom et l'e-mail du titulaire du compte, et le mot de passe (conservé uniquement chiffré) ;",
            "les données de l'établissement : nom, adresse, téléphone, e-mail, numéro fiscal, équipe, prestations, prix, horaires, carte et liens vers les réseaux sociaux.",
          ],
          "Données techniques : cookies de session pour les comptes connectés, un cookie de langue et les journaux du serveur (comme l'adresse IP et l'heure de la requête), conservés pour la sécurité.",
        ],
      },
      {
        title: "3. Pourquoi et sur quelle base légale",
        body: [
          [
            "effectuer et gérer la réservation : exécution d'un contrat (art. 6.1.b du RGPD) ;",
            "gérer les comptes et abonnements des professionnels : exécution d'un contrat ;",
            "publier les avis et empêcher les faux avis : intérêt légitime à un catalogue fiable (art. 6.1.f) ;",
            "assurer la sécurité du site : intérêt légitime ;",
            "respecter les obligations fiscales et comptables : obligation légale (art. 6.1.c).",
          ],
          "Nous ne vendons pas de données personnelles et ne les utilisons pas pour la publicité.",
        ],
      },
      {
        title: "4. Le rôle du salon et le nôtre",
        body: [
          "Pour les réservations, le salon que vous choisissez décide de l'usage des données de ses clients et en est le responsable du traitement. Astrabela traite ces données pour le compte du salon, en tant que sous-traitant (art. 28 du RGPD), uniquement pour fournir le service. Pour les avis, le catalogue public et la sécurité du site, Astrabela est responsable du traitement.",
        ],
      },
      {
        title: "5. Qui reçoit les données",
        body: [
          "Le salon ou le restaurant où vous réservez. Nous faisons aussi appel à ces prestataires, liés par des accords de traitement des données :",
          [
            "Vercel Inc. – hébergement ; le site fonctionne à Francfort (UE). Vercel est une société américaine : tout transfert hors de l'UE est couvert par les clauses contractuelles types de l'UE et par le cadre de protection des données UE-États-Unis ;",
            "Neon – base de données, hébergée à Francfort (UE) ;",
            "Cloudflare – service de noms de domaine (DNS) ;",
            "Google – uniquement si vous choisissez de vous connecter avec Google.",
          ],
        ],
      },
      {
        title: "6. Combien de temps",
        body: [
          [
            "données des clients et des réservations : tant que le compte du salon est actif et au plus 2 ans après votre dernière visite ;",
            "avis : tant que le salon est sur Astrabela ;",
            "comptes clients : jusqu'à leur suppression (bouton sur la page du compte) ;",
            "comptes professionnels : jusqu'à la fermeture du compte ;",
            "factures et données de facturation : 10 ans, comme l'exige la loi fiscale portugaise ;",
            "sessions de connexion des professionnels : 30 jours.",
          ],
        ],
      },
      {
        title: "7. Cookies",
        body: [
          "Nous n'utilisons que les cookies nécessaires au fonctionnement du site : ceux qui vous gardent connecté (et affichent votre nom dans le menu), d'autres de courte durée pendant la connexion avec Google, un pour mémoriser la langue et un qui retient les plats que vous avez aimés sur la carte d'un restaurant (créé seulement quand vous appuyez sur ♥ ; il contient un code aléatoire, pas votre nom). Nous n'utilisons ni cookies de mesure d'audience ni cookies publicitaires, c'est pourquoi nous ne demandons pas de consentement aux cookies.",
        ],
      },
      {
        title: "8. Vos droits",
        body: [
          `Vous pouvez demander l'accès à vos données, leur rectification ou leur effacement, la limitation du traitement ou vous y opposer, et les recevoir dans un format portable. Écrivez à ${o.email} ; nous répondons dans un délai d'un mois. Si les données ont été communiquées à un salon, nous lui transmettons aussi votre demande. Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr) ou de l'autorité portugaise, la CNPD (www.cnpd.pt).`,
        ],
      },
      {
        title: "9. Sécurité",
        body: [
          "Le site fonctionne uniquement en HTTPS, les mots de passe sont conservés chiffrés et les liens de réservation et d'avis sont personnels et difficiles à deviner. Ne partagez pas votre lien personnel.",
        ],
      },
      {
        title: "10. Modifications",
        body: ["Si nous modifions cette politique, la nouvelle version sera publiée ici avec sa date. Les changements importants seront annoncés sur le site."],
      },
    ],
  };
}

function termsFr(): LegalDoc {
  const o = operator();
  return {
    title: "Conditions d'utilisation",
    updated: "Dernière mise à jour : 28 octobre 2026",
    intro: `Ces conditions régissent l'utilisation d'astrabela.com, exploité par ${who()}. En utilisant le site ou en créant un compte professionnel, vous les acceptez.`,
    sections: [
      {
        title: "1. Le service",
        body: [
          "Astrabela permet aux clients de trouver des salons de beauté, des barbiers et des restaurants, de réserver des prestations en ligne, de noter les professionnels et de consulter les cartes des restaurants. Les salons et restaurants gèrent leur profil, leur équipe, leurs prestations, leur agenda et leur carte dans leur compte professionnel.",
        ],
      },
      {
        title: "2. Pour les clients",
        body: [
          [
            "Astrabela est gratuit et ne nécessite pas de compte.",
            "La réservation est un accord entre vous et le salon. Les prestations, les prix et les durées sont fixés par le salon, et la prestation est fournie par le salon, pas par Astrabela.",
            "Astrabela n'encaisse aucun paiement : vous payez directement le salon.",
            "Vous pouvez annuler avec le lien personnel que vous recevez. Merci d'annuler si vous ne pouvez pas venir.",
          ],
        ],
      },
      {
        title: "3. Avis",
        body: [
          "Tout client connecté à un compte Astrabela peut noter un professionnel d'un salon, une fois tous les 30 jours par professionnel. Les clients dont la visite a été réservée sur Astrabela ou confirmée par le salon peuvent aussi noter avec leur lien personnel, et ces avis portent la mention de visite confirmée. Un avis doit :",
          [
            "décrire votre propre expérience réelle ;",
            "ne contenir ni insultes, ni menaces, ni discrimination ;",
            "ne contenir ni données personnelles d'autrui, ni publicité, ni liens.",
          ],
          "Nous pouvons masquer les avis qui ne respectent pas ces règles. Le salon ne peut ni supprimer ni modifier les avis ; il peut répondre publiquement ou signaler un avis à la modération.",
        ],
      },
      {
        title: "4. Pour les salons et restaurants",
        body: [
          [
            "Les informations du profil, les prix et la carte doivent être exacts et à jour. Vous en êtes responsable, ainsi que des prestations que vous fournissez.",
            "Gardez votre mot de passe secret ; vous êtes responsable de l'activité de votre compte.",
            "Ne créez pas de fausses réservations, de faux avis ni de fausses demandes d'avis, et ne demandez pas d'avis en échange d'une récompense.",
            "Seuls les profils avec un abonnement actif ou une période gratuite apparaissent dans la recherche.",
          ],
        ],
      },
      {
        title: "5. Tarifs",
        body: [
          "Pour les salons, barbiers et restaurants, les 3 premiers mois sont gratuits, sans carte bancaire pour commencer. Ensuite, un abonnement est nécessaire pour rester visible :",
          PRICES.fr,
          "Les conditions de paiement sont affichées avant tout prélèvement. Nous pouvons modifier les prix avec un préavis d'au moins 30 jours ; le changement s'applique à partir de la période de facturation suivante.",
        ],
      },
      {
        title: "6. Accord de traitement des données (professionnels)",
        body: [
          "Pour les données des clients liées aux réservations, l'établissement est responsable du traitement et Astrabela est son sous-traitant (art. 28 du RGPD). Astrabela :",
          [
            "traite ces données uniquement pour fournir le service et selon les instructions que l'établissement donne via le site ;",
            "les garde confidentielles et protégées par des mesures de sécurité appropriées ;",
            "n'utilise que les sous-traitants indiqués dans la politique de confidentialité et informe les établissements avant d'en ajouter d'autres ;",
            "aide l'établissement à répondre aux demandes des clients et à notifier les violations de données ;",
            "supprime ou restitue les données à la fermeture du compte, sauf ce que la loi nous oblige à conserver.",
          ],
        ],
      },
      {
        title: "7. Suspension et fermeture du compte",
        body: [
          "Vous pouvez fermer votre compte professionnel à tout moment en nous écrivant. Nous pouvons suspendre ou retirer un profil qui enfreint ces conditions, la loi ou les droits de tiers, en expliquant le motif.",
        ],
      },
      {
        title: "8. Responsabilité",
        body: [
          "Nous faisons de notre mieux pour que le site reste disponible et exact, mais nous ne pouvons pas garantir qu'il fonctionne toujours sans interruption ni erreur. Astrabela n'est pas partie à l'accord entre le client et le salon et ne répond pas des prestations fournies par les salons. Rien dans ces conditions ne limite les droits que la loi reconnaît aux consommateurs.",
        ],
      },
      {
        title: "9. Droit applicable et réclamations",
        body: [
          `Ces conditions sont régies par le droit portugais, sans préjudice de la protection que vous accorde la loi de votre pays de résidence en tant que consommateur. Pour toute réclamation, écrivez à ${o.email}. Les consommateurs résidant en France peuvent aussi signaler un problème sur SignalConso (signal.conso.gouv.fr) et, en cas de litige, saisir les tribunaux compétents.`,
        ],
      },
      {
        title: "10. Modifications",
        body: ["Nous pouvons mettre à jour ces conditions. La nouvelle version est publiée ici avec sa date ; les professionnels seront prévenus à l'avance des changements importants."],
      },
    ],
  };
}

function privacyIt(): LegalDoc {
  const o = operator();
  return {
    title: "Informativa sulla privacy",
    updated: "Ultimo aggiornamento: 28 ottobre 2026",
    intro:
      "Astrabela è un catalogo di saloni di bellezza, barbieri e ristoranti nell'Unione europea, con prenotazione online e recensioni dei clienti su ogni professionista. Questa informativa spiega quali dati personali trattiamo, perché e quali sono i tuoi diritti secondo il GDPR.",
    sections: [
      { title: "1. Chi siamo", body: [`Il sito astrabela.com è gestito da ${who()}. Per qualsiasi domanda sui tuoi dati, scrivi a ${o.email}.`] },
      {
        title: "2. Quali dati trattiamo",
        body: [
          "Quando prenoti o lasci una recensione (clienti):",
          [
            "il nome, l'e-mail e il cellulare che indichi nella prenotazione, e la nota che lasci al salone;",
            "la prenotazione stessa: salone, professionista, servizio, data, ora e stato;",
            "la tua recensione: valutazione, testo e il nome che scegli di mostrare;",
            "se crei un account cliente: nome ed e-mail, e una password conservata solo in forma cifrata (hash) oppure, con Google, l'identificativo del tuo account Google (non vediamo mai la tua password Google).",
          ],
          "Quando un salone o un ristorante usa Astrabela (attività):",
          [
            "il nome e l'e-mail del titolare dell'account, e la password (conservata solo cifrata);",
            "i dati dell'attività: nome, indirizzo, telefono, e-mail, partita IVA, team, servizi, prezzi, orari, menu e link ai social.",
          ],
          "Dati tecnici: cookie di sessione per gli account con accesso attivo, un cookie della lingua e i log del server (come l'indirizzo IP e l'ora della richiesta), conservati per sicurezza.",
        ],
      },
      {
        title: "3. Perché e su quale base giuridica",
        body: [
          [
            "effettuare e gestire la prenotazione: esecuzione di un contratto (art. 6.1.b del GDPR);",
            "gestire gli account e gli abbonamenti delle attività: esecuzione di un contratto;",
            "pubblicare le recensioni e impedire quelle false: legittimo interesse a un catalogo affidabile (art. 6.1.f);",
            "mantenere il sito sicuro: legittimo interesse;",
            "adempiere agli obblighi fiscali e contabili: obbligo di legge (art. 6.1.c).",
          ],
          "Non vendiamo dati personali e non li usiamo per la pubblicità.",
        ],
      },
      {
        title: "4. Il ruolo del salone e il nostro",
        body: [
          "Per le prenotazioni, il salone che scegli decide come usare i dati dei suoi clienti ed è il titolare del trattamento di quei dati. Astrabela li tratta per conto del salone, come responsabile del trattamento (art. 28 del GDPR), solo per fornire il servizio. Per le recensioni, il catalogo pubblico e la sicurezza del sito, il titolare del trattamento è Astrabela.",
        ],
      },
      {
        title: "5. Chi riceve i dati",
        body: [
          "Il salone o il ristorante dove prenoti. Usiamo inoltre questi fornitori di servizi, vincolati da accordi sul trattamento dei dati:",
          [
            "Vercel Inc. – hosting; il sito funziona a Francoforte (UE). Vercel è una società statunitense, quindi ogni trasferimento fuori dall'UE è coperto dalle Clausole contrattuali tipo dell'UE e dal Quadro UE-USA per la protezione dei dati;",
            "Neon – database, conservato a Francoforte (UE);",
            "Cloudflare – servizio dei nomi di dominio (DNS);",
            "Google – solo se scegli di accedere con Google.",
          ],
        ],
      },
      {
        title: "6. Per quanto tempo",
        body: [
          [
            "dati dei clienti e delle prenotazioni: finché l'account del salone è attivo e al massimo 2 anni dopo la tua ultima visita;",
            "recensioni: finché il salone è su Astrabela;",
            "account cliente: finché non lo elimini (pulsante nella pagina dell'account);",
            "account delle attività: fino alla chiusura dell'account;",
            "fatture e dati di fatturazione: 10 anni, come richiede la legge fiscale portoghese;",
            "sessioni di accesso delle attività: 30 giorni.",
          ],
        ],
      },
      {
        title: "7. Cookie",
        body: [
          "Usiamo solo i cookie necessari al funzionamento del sito: quelli che mantengono l'accesso (e mostrano il tuo nome nel menu), altri di breve durata durante l'accesso con Google, uno per ricordare la lingua e uno che ricorda i piatti che ti sono piaciuti nel menu di un ristorante (creato solo quando tocchi ♥; contiene un codice casuale, non il tuo nome). Non usiamo cookie di analisi né pubblicitari, perciò non chiediamo il consenso ai cookie.",
        ],
      },
      {
        title: "8. I tuoi diritti",
        body: [
          `Puoi chiedere l'accesso, la rettifica o la cancellazione dei tuoi dati, la limitazione del trattamento o opporti a esso, e riceverli in un formato portabile. Scrivi a ${o.email}; rispondiamo entro un mese. Se i dati sono stati forniti a un salone, gli inoltriamo anche la tua richiesta. Puoi inoltre proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it) o all'autorità portoghese, la CNPD (www.cnpd.pt).`,
        ],
      },
      {
        title: "9. Sicurezza",
        body: [
          "Il sito funziona solo in HTTPS, le password sono conservate cifrate e i link di prenotazione e di recensione sono personali e difficili da indovinare. Non condividere il tuo link personale.",
        ],
      },
      {
        title: "10. Modifiche",
        body: ["Se modifichiamo questa informativa, pubblicheremo qui la nuova versione con la sua data. Le modifiche importanti saranno annunciate sul sito."],
      },
    ],
  };
}

function termsIt(): LegalDoc {
  const o = operator();
  return {
    title: "Termini di utilizzo",
    updated: "Ultimo aggiornamento: 28 ottobre 2026",
    intro: `Questi termini regolano l'uso di astrabela.com, gestito da ${who()}. Usando il sito o creando un account per la tua attività, li accetti.`,
    sections: [
      {
        title: "1. Il servizio",
        body: [
          "Astrabela permette ai clienti di trovare saloni di bellezza, barbieri e ristoranti, prenotare servizi online, recensire i professionisti e consultare i menu dei ristoranti. I saloni e i ristoranti gestiscono profilo, team, servizi, agenda e menu nel loro account.",
        ],
      },
      {
        title: "2. Per i clienti",
        body: [
          [
            "Usare Astrabela è gratuito e non richiede un account.",
            "La prenotazione è un accordo tra te e il salone. Servizi, prezzi e durata sono stabiliti dal salone, e il servizio è fornito dal salone, non da Astrabela.",
            "Astrabela non incassa pagamenti: paghi direttamente il salone.",
            "Puoi annullare con il link personale che ricevi. Per favore annulla se non puoi venire.",
          ],
        ],
      },
      {
        title: "3. Recensioni",
        body: [
          "Ogni cliente con l'accesso attivo a un account Astrabela può recensire un professionista di un salone, una volta ogni 30 giorni per professionista. I clienti con una visita prenotata su Astrabela o confermata dal salone possono recensire anche con il loro link personale, e queste recensioni portano il segno di visita confermata. Una recensione deve:",
          [
            "descrivere la tua esperienza reale;",
            "non contenere insulti, minacce o discriminazioni;",
            "non contenere dati personali di altre persone, pubblicità o link.",
          ],
          "Possiamo nascondere le recensioni che violano queste regole. Il salone non può eliminare né modificare le recensioni; può rispondere pubblicamente o segnalare una recensione alla moderazione.",
        ],
      },
      {
        title: "4. Per saloni e ristoranti",
        body: [
          [
            "Le informazioni del profilo, i prezzi e il menu devono essere veritieri e aggiornati. Ne sei responsabile, come dei servizi che fornisci.",
            "Mantieni segreta la password; sei responsabile dell'attività nel tuo account.",
            "Non creare prenotazioni, recensioni o richieste di recensione false, e non chiedere recensioni in cambio di premi.",
            "Nella ricerca compaiono solo i profili con un abbonamento attivo o un periodo gratuito.",
          ],
        ],
      },
      {
        title: "5. Prezzi",
        body: [
          "Per saloni, barbieri e ristoranti i primi 3 mesi sono gratuiti e non serve una carta per iniziare. Dopo, per restare visibili serve un abbonamento:",
          PRICES.it,
          "Le condizioni di pagamento sono mostrate prima di qualsiasi addebito. Possiamo cambiare i prezzi con almeno 30 giorni di preavviso; il cambio si applica dal periodo di fatturazione successivo.",
        ],
      },
      {
        title: "6. Accordo sul trattamento dei dati (attività)",
        body: [
          "Per i dati dei clienti nelle prenotazioni, l'attività è titolare del trattamento e Astrabela è il suo responsabile del trattamento (art. 28 del GDPR). Astrabela:",
          [
            "tratta questi dati solo per fornire il servizio e secondo le istruzioni che l'attività dà tramite il sito;",
            "li mantiene riservati e protetti con misure di sicurezza adeguate;",
            "usa solo i sub-responsabili indicati nell'informativa sulla privacy e informa le attività prima di aggiungerne altri;",
            "aiuta l'attività a rispondere alle richieste dei clienti e a notificare le violazioni dei dati;",
            "cancella o restituisce i dati alla chiusura dell'account, salvo ciò che la legge ci obbliga a conservare.",
          ],
        ],
      },
      {
        title: "7. Sospensione e chiusura dell'account",
        body: [
          "Puoi chiudere l'account della tua attività in qualsiasi momento scrivendoci. Possiamo sospendere o rimuovere un profilo che viola questi termini, la legge o i diritti di terzi, spiegandone il motivo.",
        ],
      },
      {
        title: "8. Responsabilità",
        body: [
          "Ci impegniamo a mantenere il sito disponibile e corretto, ma non possiamo garantire che funzioni sempre senza interruzioni o errori. Astrabela non è parte dell'accordo tra cliente e salone e non risponde dei servizi forniti dai saloni. Nulla in questi termini limita i diritti che la legge riconosce ai consumatori.",
        ],
      },
      {
        title: "9. Legge applicabile e reclami",
        body: [
          `Questi termini sono regolati dalla legge portoghese, fatta salva la tutela che ti riconosce come consumatore la legge del tuo paese di residenza. Per qualsiasi reclamo, scrivi a ${o.email}. I consumatori residenti in Italia possono rivolgersi anche alle associazioni dei consumatori e, in caso di controversia, a un organismo di risoluzione alternativa delle controversie o al giudice competente.`,
        ],
      },
      {
        title: "10. Modifiche",
        body: ["Possiamo aggiornare questi termini. La nuova versione è pubblicata qui con la sua data; avviseremo in anticipo le attività delle modifiche importanti."],
      },
    ],
  };
}

function privacyDe(): LegalDoc {
  const o = operator();
  return {
    title: "Datenschutzerklärung",
    updated: "Stand: 28. Oktober 2026",
    intro:
      "Astrabela ist ein Katalog von Beautysalons, Barbershops und Restaurants in der Europäischen Union, mit Online-Buchung und Kundenbewertungen zu jedem Profi. Diese Erklärung beschreibt, welche personenbezogenen Daten wir verarbeiten, warum, und welche Rechte Sie nach der DSGVO haben.",
    sections: [
      { title: "1. Wer wir sind", body: [`Die Website astrabela.com wird betrieben von ${who()}. Bei Fragen zu Ihren Daten schreiben Sie an ${o.email}.`] },
      {
        title: "2. Welche Daten wir verarbeiten",
        body: [
          "Wenn Sie buchen oder bewerten (Kunden):",
          [
            "Name, E-Mail und Handynummer, die Sie bei der Buchung angeben, und Ihre Nachricht an den Salon;",
            "die Buchung selbst: Salon, Profi, Leistung, Datum, Uhrzeit und Status;",
            "Ihre Bewertung: Sterne, Text und der Name, den Sie anzeigen möchten;",
            "wenn Sie ein Kundenkonto anlegen: Name und E-Mail sowie ein Passwort, das nur verschlüsselt (gehasht) gespeichert wird, oder bei Google die Kennung Ihres Google-Kontos (Ihr Google-Passwort sehen wir nie).",
          ],
          "Wenn ein Salon oder Restaurant Astrabela nutzt (Unternehmen):",
          [
            "Name und E-Mail des Kontoinhabers sowie das Passwort (nur verschlüsselt gespeichert);",
            "Unternehmensdaten: Name, Adresse, Telefon, E-Mail, Steuernummer, Team, Leistungen, Preise, Öffnungszeiten, Speisekarte und Links zu sozialen Netzwerken.",
          ],
          "Technische Daten: Sitzungs-Cookies für angemeldete Konten, ein Sprach-Cookie und Server-Protokolle (etwa IP-Adresse und Zeitpunkt der Anfrage), die aus Sicherheitsgründen gespeichert werden.",
        ],
      },
      {
        title: "3. Zwecke und Rechtsgrundlagen",
        body: [
          [
            "Buchungen durchführen und verwalten: Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO);",
            "Konten und Abonnements der Unternehmen verwalten: Vertragserfüllung;",
            "Bewertungen veröffentlichen und gefälschte verhindern: berechtigtes Interesse an einem vertrauenswürdigen Katalog (Art. 6 Abs. 1 lit. f);",
            "die Website sicher betreiben: berechtigtes Interesse;",
            "steuerliche und buchhalterische Pflichten erfüllen: rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c).",
          ],
          "Wir verkaufen keine personenbezogenen Daten und nutzen sie nicht für Werbung.",
        ],
      },
      {
        title: "4. Die Rolle des Salons und unsere",
        body: [
          "Bei Buchungen entscheidet der von Ihnen gewählte Salon, wie er die Daten seiner Kunden nutzt, und ist dafür Verantwortlicher. Astrabela verarbeitet diese Daten im Auftrag des Salons als Auftragsverarbeiter (Art. 28 DSGVO) und nur, um den Dienst zu erbringen. Für Bewertungen, den öffentlichen Katalog und die Sicherheit der Website ist Astrabela Verantwortlicher.",
        ],
      },
      {
        title: "5. Empfänger der Daten",
        body: [
          "Der Salon oder das Restaurant, bei dem Sie buchen. Außerdem nutzen wir folgende Dienstleister, die an Verträge zur Auftragsverarbeitung gebunden sind:",
          [
            "Vercel Inc. – Hosting; die Website läuft in Frankfurt (EU). Vercel ist ein US-Unternehmen; Übermittlungen außerhalb der EU sind durch die EU-Standardvertragsklauseln und das EU-US Data Privacy Framework abgesichert;",
            "Neon – Datenbank, gespeichert in Frankfurt (EU);",
            "Cloudflare – Domain-Namensdienst (DNS);",
            "Google – nur wenn Sie sich mit Google anmelden.",
          ],
        ],
      },
      {
        title: "6. Speicherdauer",
        body: [
          [
            "Kunden- und Buchungsdaten: solange das Konto des Salons aktiv ist und höchstens 2 Jahre nach Ihrem letzten Besuch;",
            "Bewertungen: solange der Salon auf Astrabela ist;",
            "Kundenkonten: bis Sie sie löschen (Button auf der Kontoseite);",
            "Unternehmenskonten: bis zur Schließung des Kontos;",
            "Rechnungen und Abrechnungsdaten: 10 Jahre, wie es das portugiesische Steuerrecht verlangt;",
            "Anmeldesitzungen der Unternehmen: 30 Tage.",
          ],
        ],
      },
      {
        title: "7. Cookies",
        body: [
          "Wir verwenden nur Cookies, die für den Betrieb der Website nötig sind: solche, die Sie angemeldet halten (und Ihren Namen im Menü zeigen), kurzlebige während der Anmeldung mit Google, eines für die Sprache und eines, das sich Gerichte merkt, die Ihnen auf der Speisekarte eines Restaurants gefallen haben (es entsteht erst, wenn Sie ♥ antippen, und enthält einen Zufallscode, nicht Ihren Namen). Wir verwenden keine Analyse- oder Werbe-Cookies und fragen deshalb keine Cookie-Einwilligung ab.",
        ],
      },
      {
        title: "8. Ihre Rechte",
        body: [
          `Sie können Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen, die Einschränkung der Verarbeitung oder Widerspruch dagegen, und Ihre Daten in einem übertragbaren Format erhalten. Schreiben Sie an ${o.email}; wir antworten innerhalb eines Monats. Wurden die Daten einem Salon übermittelt, leiten wir Ihre Anfrage auch an ihn weiter. Sie können sich außerdem bei der Datenschutzaufsichtsbehörde Ihres Bundeslandes oder bei der portugiesischen Behörde CNPD (www.cnpd.pt) beschweren.`,
        ],
      },
      {
        title: "9. Sicherheit",
        body: [
          "Die Website läuft nur über HTTPS, Passwörter werden verschlüsselt gespeichert, und Buchungs- und Bewertungslinks sind persönlich und schwer zu erraten. Geben Sie Ihren persönlichen Link nicht weiter.",
        ],
      },
      {
        title: "10. Änderungen",
        body: ["Wenn wir diese Erklärung ändern, veröffentlichen wir die neue Fassung hier mit Datum. Wichtige Änderungen kündigen wir auf der Website an."],
      },
    ],
  };
}

function termsDe(): LegalDoc {
  const o = operator();
  return {
    title: "Nutzungsbedingungen",
    updated: "Stand: 28. Oktober 2026",
    intro: `Diese Bedingungen regeln die Nutzung von astrabela.com, betrieben von ${who()}. Mit der Nutzung der Website oder dem Anlegen eines Unternehmenskontos akzeptieren Sie sie.`,
    sections: [
      {
        title: "1. Der Dienst",
        body: [
          "Mit Astrabela finden Kunden Beautysalons, Barbershops und Restaurants, buchen Leistungen online, bewerten Profis und sehen Speisekarten von Restaurants ein. Salons und Restaurants verwalten Profil, Team, Leistungen, Kalender und Speisekarte in ihrem Unternehmenskonto.",
        ],
      },
      {
        title: "2. Für Kunden",
        body: [
          [
            "Die Nutzung von Astrabela ist kostenlos und erfordert kein Konto.",
            "Die Buchung ist eine Vereinbarung zwischen Ihnen und dem Salon. Leistungen, Preise und Dauer legt der Salon fest, und die Leistung erbringt der Salon, nicht Astrabela.",
            "Astrabela nimmt keine Zahlungen entgegen: Sie bezahlen direkt beim Salon.",
            "Sie können über den persönlichen Link absagen, den Sie erhalten. Bitte sagen Sie ab, wenn Sie nicht kommen können.",
          ],
        ],
      },
      {
        title: "3. Bewertungen",
        body: [
          "Jeder bei Astrabela angemeldete Kunde kann einen Profi eines Salons bewerten, einmal alle 30 Tage pro Profi. Kunden mit einem über Astrabela gebuchten oder vom Salon bestätigten Besuch können auch über ihren persönlichen Link bewerten; diese Bewertungen tragen den Hinweis auf den bestätigten Besuch. Eine Bewertung muss:",
          [
            "Ihre eigene, echte Erfahrung beschreiben;",
            "frei von Beleidigungen, Drohungen und Diskriminierung sein;",
            "keine personenbezogenen Daten Dritter, keine Werbung und keine Links enthalten.",
          ],
          "Wir können Bewertungen ausblenden, die gegen diese Regeln verstoßen. Der Salon kann Bewertungen weder löschen noch ändern; er kann öffentlich antworten oder eine Bewertung der Moderation melden.",
        ],
      },
      {
        title: "4. Für Salons und Restaurants",
        body: [
          [
            "Profilangaben, Preise und Speisekarte müssen wahr und aktuell sein. Sie sind dafür und für Ihre Leistungen verantwortlich.",
            "Halten Sie Ihr Passwort geheim; Sie sind für die Aktivitäten in Ihrem Konto verantwortlich.",
            "Erstellen Sie keine gefälschten Buchungen, Bewertungen oder Bewertungsanfragen und bitten Sie nicht gegen Belohnung um Bewertungen.",
            "In der Suche erscheinen nur Profile mit aktivem Abonnement oder kostenlosem Zeitraum.",
          ],
        ],
      },
      {
        title: "5. Preise",
        body: [
          "Für Salons, Barbershops und Restaurants sind die ersten 3 Monate kostenlos, ohne Karte zum Start. Danach ist für die Sichtbarkeit ein Abonnement nötig:",
          PRICES.de,
          "Die Zahlungsbedingungen werden vor jeder Abbuchung angezeigt. Wir können die Preise mit mindestens 30 Tagen Vorankündigung ändern; die Änderung gilt ab dem nächsten Abrechnungszeitraum.",
        ],
      },
      {
        title: "6. Vereinbarung zur Auftragsverarbeitung (Unternehmen)",
        body: [
          "Für die Kundendaten in Buchungen ist das Unternehmen Verantwortlicher und Astrabela sein Auftragsverarbeiter (Art. 28 DSGVO). Astrabela:",
          [
            "verarbeitet diese Daten nur zur Erbringung des Dienstes und nach den Weisungen, die das Unternehmen über die Website erteilt;",
            "behandelt sie vertraulich und schützt sie mit angemessenen Sicherheitsmaßnahmen;",
            "setzt nur die in der Datenschutzerklärung genannten Unterauftragsverarbeiter ein und informiert die Unternehmen, bevor weitere hinzukommen;",
            "unterstützt das Unternehmen bei Anfragen von Kunden und bei der Meldung von Datenschutzverletzungen;",
            "löscht oder übergibt die Daten bei Schließung des Kontos, soweit wir sie nicht gesetzlich aufbewahren müssen.",
          ],
        ],
      },
      {
        title: "7. Sperrung und Schließung des Kontos",
        body: [
          "Sie können Ihr Unternehmenskonto jederzeit schließen, indem Sie uns schreiben. Wir können ein Profil sperren oder entfernen, das gegen diese Bedingungen, das Gesetz oder Rechte Dritter verstößt, und nennen dabei den Grund.",
        ],
      },
      {
        title: "8. Haftung",
        body: [
          "Wir bemühen uns, die Website verfügbar und korrekt zu halten, können aber nicht garantieren, dass sie immer ohne Unterbrechungen oder Fehler funktioniert. Astrabela ist nicht Partei der Vereinbarung zwischen Kunde und Salon und haftet nicht für die Leistungen der Salons. Nichts in diesen Bedingungen schränkt die gesetzlichen Rechte von Verbrauchern ein.",
        ],
      },
      {
        title: "9. Anwendbares Recht und Beschwerden",
        body: [
          `Diese Bedingungen unterliegen portugiesischem Recht, unbeschadet des Schutzes, den Ihnen das Recht Ihres Wohnsitzlandes als Verbraucher gewährt. Für Beschwerden schreiben Sie an ${o.email}. Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.`,
        ],
      },
      {
        title: "10. Änderungen",
        body: ["Wir können diese Bedingungen aktualisieren. Die neue Fassung wird hier mit Datum veröffentlicht; Unternehmen informieren wir vorab über wichtige Änderungen."],
      },
    ],
  };
}

function privacyNl(): LegalDoc {
  const o = operator();
  return {
    title: "Privacyverklaring",
    updated: "Laatst bijgewerkt: 28 oktober 2026",
    intro:
      "Astrabela is een overzicht van schoonheidssalons, barbershops en restaurants in de Europese Unie, met online boeken en klantreviews van elke professional. Deze verklaring legt uit welke persoonsgegevens we verwerken, waarom, en welke rechten je hebt onder de AVG.",
    sections: [
      { title: "1. Wie we zijn", body: [`De website astrabela.com wordt beheerd door ${who()}. Vragen over je gegevens kun je sturen naar ${o.email}.`] },
      {
        title: "2. Welke gegevens we verwerken",
        body: [
          "Als je boekt of een review geeft (klanten):",
          [
            "naam, e-mail en mobiel nummer die je bij het boeken invult, en je bericht aan de salon;",
            "de boeking zelf: salon, professional, behandeling, datum, tijd en status;",
            "je review: sterren, tekst en de naam die je wilt tonen;",
            "als je een klantaccount aanmaakt: naam en e-mail en een wachtwoord dat alleen versleuteld (gehasht) wordt opgeslagen, of bij Google de ID van je Google-account (je Google-wachtwoord zien we nooit).",
          ],
          "Als een salon of restaurant Astrabela gebruikt (bedrijven):",
          [
            "naam en e-mail van de accounthouder en het wachtwoord (alleen versleuteld opgeslagen);",
            "bedrijfsgegevens: naam, adres, telefoon, e-mail, fiscaal nummer, team, behandelingen, prijzen, openingstijden, menukaart en links naar sociale media.",
          ],
          "Technische gegevens: sessiecookies voor ingelogde accounts, een taalcookie en serverlogs (zoals IP-adres en tijdstip van het verzoek), die we om veiligheidsredenen bewaren.",
        ],
      },
      {
        title: "3. Doelen en grondslagen",
        body: [
          [
            "boekingen uitvoeren en beheren: uitvoering van een overeenkomst (art. 6 lid 1 sub b AVG);",
            "accounts en abonnementen van bedrijven beheren: uitvoering van een overeenkomst;",
            "reviews publiceren en nepreviews voorkomen: gerechtvaardigd belang bij een betrouwbaar overzicht (art. 6 lid 1 sub f);",
            "de website veilig houden: gerechtvaardigd belang;",
            "fiscale en boekhoudkundige verplichtingen nakomen: wettelijke verplichting (art. 6 lid 1 sub c).",
          ],
          "We verkopen geen persoonsgegevens en gebruiken ze niet voor reclame.",
        ],
      },
      {
        title: "4. De rol van de salon en die van ons",
        body: [
          "Bij boekingen bepaalt de salon die je kiest hoe hij de gegevens van zijn klanten gebruikt; de salon is daarvoor verwerkingsverantwoordelijke. Astrabela verwerkt die gegevens namens de salon als verwerker (art. 28 AVG) en alleen om de dienst te leveren. Voor reviews, het openbare overzicht en de beveiliging van de website is Astrabela verwerkingsverantwoordelijke.",
        ],
      },
      {
        title: "5. Ontvangers van de gegevens",
        body: [
          "De salon of het restaurant waar je boekt. Daarnaast gebruiken we deze dienstverleners, die gebonden zijn aan verwerkersovereenkomsten:",
          [
            "Vercel Inc. – hosting; de website draait in Frankfurt (EU). Vercel is een Amerikaans bedrijf; doorgiften buiten de EU vallen onder de modelcontractbepalingen van de EU en het EU-US Data Privacy Framework;",
            "Neon – database, opgeslagen in Frankfurt (EU);",
            "Cloudflare – domeinnaamdienst (DNS);",
            "Google – alleen als je inlogt met Google.",
          ],
        ],
      },
      {
        title: "6. Bewaartermijnen",
        body: [
          [
            "klant- en boekingsgegevens: zolang het account van de salon actief is en uiterlijk 2 jaar na je laatste bezoek;",
            "reviews: zolang de salon op Astrabela staat;",
            "klantaccounts: tot je ze verwijdert (knop op de accountpagina);",
            "bedrijfsaccounts: tot het account wordt gesloten;",
            "facturen en betaalgegevens: 10 jaar, zoals de Portugese belastingwet vereist;",
            "inlogsessies van bedrijven: 30 dagen.",
          ],
        ],
      },
      {
        title: "7. Cookies",
        body: [
          "We gebruiken alleen cookies die nodig zijn om de website te laten werken: cookies die je ingelogd houden (en je naam in het menu tonen), kortdurende cookies tijdens het inloggen met Google, één voor de taal en één die onthoudt welke gerechten je leuk vond op de menukaart van een restaurant (die ontstaat pas als je op ♥ tikt en bevat een willekeurige code, niet je naam). We gebruiken geen analytische of advertentiecookies en vragen daarom geen toestemming voor cookies.",
        ],
      },
      {
        title: "8. Je rechten",
        body: [
          `Je kunt vragen om inzage, correctie of verwijdering van je gegevens, om beperking van of bezwaar tegen de verwerking, en om je gegevens in een overdraagbaar formaat te ontvangen. Schrijf naar ${o.email}; we antwoorden binnen een maand. Zijn de gegevens aan een salon gegeven, dan sturen we je verzoek ook aan die salon door. Je kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens (www.autoriteitpersoonsgegevens.nl) of bij de Portugese toezichthouder CNPD (www.cnpd.pt).`,
        ],
      },
      {
        title: "9. Beveiliging",
        body: [
          "De website werkt alleen via HTTPS, wachtwoorden worden versleuteld opgeslagen en links voor boekingen en reviews zijn persoonlijk en moeilijk te raden. Deel je persoonlijke link niet met anderen.",
        ],
      },
      {
        title: "10. Wijzigingen",
        body: ["Als we deze verklaring wijzigen, publiceren we de nieuwe versie hier met datum. Belangrijke wijzigingen kondigen we aan op de website."],
      },
    ],
  };
}

function termsNl(): LegalDoc {
  const o = operator();
  return {
    title: "Gebruiksvoorwaarden",
    updated: "Laatst bijgewerkt: 28 oktober 2026",
    intro: `Deze voorwaarden gelden voor het gebruik van astrabela.com, beheerd door ${who()}. Door de website te gebruiken of een bedrijfsaccount aan te maken, ga je ermee akkoord.`,
    sections: [
      {
        title: "1. De dienst",
        body: [
          "Met Astrabela vinden klanten schoonheidssalons, barbershops en restaurants, boeken ze online behandelingen, beoordelen ze professionals en bekijken ze menukaarten van restaurants. Salons en restaurants beheren hun profiel, team, behandelingen, agenda en menukaart in hun bedrijfsaccount.",
        ],
      },
      {
        title: "2. Voor klanten",
        body: [
          [
            "Astrabela gebruiken is gratis en je hebt geen account nodig.",
            "Een boeking is een afspraak tussen jou en de salon. De salon bepaalt behandelingen, prijzen en duur, en de salon voert de behandeling uit, niet Astrabela.",
            "Astrabela ontvangt geen betalingen: je betaalt rechtstreeks bij de salon.",
            "Je kunt annuleren via de persoonlijke link die je krijgt. Annuleer alsjeblieft als je niet kunt komen.",
          ],
        ],
      },
      {
        title: "3. Reviews",
        body: [
          "Elke ingelogde klant van Astrabela kan een professional van een salon beoordelen, één keer per 30 dagen per professional. Klanten met een bezoek dat via Astrabela is geboekt of door de salon is bevestigd, kunnen ook via hun persoonlijke link een review geven; die reviews krijgen het label van een bevestigd bezoek. Een review moet:",
          [
            "je eigen, echte ervaring beschrijven;",
            "vrij zijn van beledigingen, bedreigingen en discriminatie;",
            "geen persoonsgegevens van anderen, reclame of links bevatten.",
          ],
          "We kunnen reviews verbergen die deze regels overtreden. De salon kan reviews niet verwijderen of wijzigen; hij kan openbaar reageren of een review melden voor moderatie.",
        ],
      },
      {
        title: "4. Voor salons en restaurants",
        body: [
          [
            "Profielgegevens, prijzen en menukaart moeten juist en actueel zijn. Je bent daarvoor en voor je diensten verantwoordelijk.",
            "Houd je wachtwoord geheim; je bent verantwoordelijk voor wat er in je account gebeurt.",
            "Maak geen nepboekingen, nepreviews of nepverzoeken om reviews, en vraag niet om reviews in ruil voor een beloning.",
            "Alleen profielen met een actief abonnement of gratis periode verschijnen in de zoekresultaten.",
          ],
        ],
      },
      {
        title: "5. Prijzen",
        body: [
          "Voor salons, barbershops en restaurants zijn de eerste 3 maanden gratis, zonder kaart om te beginnen. Daarna is een abonnement nodig om zichtbaar te blijven:",
          PRICES.nl,
          "De betalingsvoorwaarden worden vóór elke afschrijving getoond. We kunnen de prijzen wijzigen met minstens 30 dagen vooraankondiging; de wijziging geldt vanaf de volgende betaalperiode.",
        ],
      },
      {
        title: "6. Verwerkersovereenkomst (bedrijven)",
        body: [
          "Voor de klantgegevens in boekingen is het bedrijf verwerkingsverantwoordelijke en Astrabela zijn verwerker (art. 28 AVG). Astrabela:",
          [
            "verwerkt die gegevens alleen om de dienst te leveren en volgens de instructies die het bedrijf via de website geeft;",
            "behandelt ze vertrouwelijk en beschermt ze met passende beveiligingsmaatregelen;",
            "schakelt alleen de subverwerkers in die in de privacyverklaring staan en informeert bedrijven voordat er nieuwe bijkomen;",
            "helpt het bedrijf bij verzoeken van klanten en bij het melden van datalekken;",
            "verwijdert of levert de gegevens bij sluiting van het account, tenzij we ze wettelijk moeten bewaren.",
          ],
        ],
      },
      {
        title: "7. Opschorting en sluiting van het account",
        body: [
          "Je kunt je bedrijfsaccount op elk moment sluiten door ons te schrijven. We kunnen een profiel opschorten of verwijderen dat deze voorwaarden, de wet of rechten van anderen schendt, en vermelden daarbij de reden.",
        ],
      },
      {
        title: "8. Aansprakelijkheid",
        body: [
          "We doen ons best om de website beschikbaar en juist te houden, maar kunnen niet garanderen dat hij altijd zonder onderbrekingen of fouten werkt. Astrabela is geen partij bij de afspraak tussen klant en salon en is niet aansprakelijk voor de diensten van salons. Niets in deze voorwaarden beperkt de wettelijke rechten van consumenten.",
        ],
      },
      {
        title: "9. Toepasselijk recht en klachten",
        body: [
          `Op deze voorwaarden is Portugees recht van toepassing, onverminderd de bescherming die het recht van je woonland je als consument biedt. Klachten kun je sturen naar ${o.email}.`,
        ],
      },
      {
        title: "10. Wijzigingen",
        body: ["We kunnen deze voorwaarden bijwerken. De nieuwe versie wordt hier met datum gepubliceerd; bedrijven informeren we vooraf over belangrijke wijzigingen."],
      },
    ],
  };
}

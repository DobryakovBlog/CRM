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
  pl: ["12,99 € miesięcznie przy płatności miesięcznej;", "10,99 € miesięcznie przy płatności co 6 miesięcy;", "9,99 € miesięcznie przy płatności rocznej."],
  cs: ["12,99 € měsíčně při měsíční platbě;", "10,99 € měsíčně při platbě na 6 měsíců;", "9,99 € měsíčně při roční platbě."],
  sk: ["12,99 € mesačne pri mesačnej platbe;", "10,99 € mesačne pri platbe na 6 mesiacov;", "9,99 € mesačne pri ročnej platbe."],
  hu: ["havi 12,99 € havi fizetés esetén;", "havi 10,99 € féléves fizetés esetén;", "havi 9,99 € éves fizetés esetén."],
  sl: ["12,99 € na mesec pri mesečnem plačilu;", "10,99 € na mesec pri plačilu za 6 mesecev;", "9,99 € na mesec pri letnem plačilu."],
  hr: ["12,99 € mjesečno uz mjesečno plaćanje;", "10,99 € mjesečno uz plaćanje za 6 mjeseci;", "9,99 € mjesečno uz godišnje plaćanje."],
  ro: ["12,99 € pe lună cu plată lunară;", "10,99 € pe lună cu plată la 6 luni;", "9,99 € pe lună cu plată anuală."],
  bg: ["12,99 € на месец при месечно плащане;", "10,99 € на месец при плащане за 6 месеца;", "9,99 € на месец при годишно плащане."],
  da: ["12,99 € om måneden ved månedlig betaling;", "10,99 € om måneden ved betaling for 6 måneder;", "9,99 € om måneden ved årlig betaling."],
  sv: ["12,99 € per månad vid månadsbetalning;", "10,99 € per månad vid betalning för 6 månader;", "9,99 € per månad vid årsbetalning."],
  nb: ["12,99 € per måned ved månedlig betaling;", "10,99 € per måned ved betaling for 6 måneder;", "9,99 € per måned ved årlig betaling."],
  fi: ["12,99 € kuukaudessa kuukausimaksulla;", "10,99 € kuukaudessa 6 kuukauden maksulla;", "9,99 € kuukaudessa vuosimaksulla."],
  et: ["12,99 € kuus igakuise maksega;", "10,99 € kuus 6 kuu maksega;", "9,99 € kuus aastamaksega."],
};

export function privacyPolicy(locale: Locale): LegalDoc {
  const o = operator();
  if (locale === "es") return privacyEs();
  if (locale === "fr") return privacyFr();
  if (locale === "it") return privacyIt();
  if (locale === "de") return privacyDe();
  if (locale === "nl") return privacyNl();
  if (locale === "pl") return privacyPl();
  if (locale === "cs") return privacyCs();
  if (locale === "sk") return privacySk();
  if (locale === "hu") return privacyHu();
  if (locale === "sl") return privacySl();
  if (locale === "hr") return privacyHr();
  if (locale === "ro") return privacyRo();
  if (locale === "bg") return privacyBg();
  if (locale === "da") return privacyDa();
  if (locale === "sv") return privacySv();
  if (locale === "nb") return privacyNb();
  if (locale === "fi") return privacyFi();
  if (locale === "et") return privacyEt();
  if (locale === "en") {
    return {
      title: "Privacy policy",
      updated: "Last updated: 30 October 2026",
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
            `You can ask us to access, correct or delete your data, to restrict or object to its processing, and to receive it in a portable format. Write to ${o.email}; we answer within one month. If the data was given to a salon, we will also pass your request on to it. You can also complain to the Portuguese data protection authority, CNPD (www.cnpd.pt), or to the data protection authority of the country where you live, such as the Spanish AEPD (www.aepd.es), the French CNIL (www.cnil.fr), the Italian Garante (www.garanteprivacy.it) or the Irish Data Protection Commission (www.dataprotection.ie).`,
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
    updated: "Última atualização: 30 de outubro de 2026",
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
          `Pode pedir acesso, retificação ou apagamento dos seus dados, a limitação ou oposição ao tratamento, e recebê-los num formato portável. Escreva para ${o.email}; respondemos no prazo de um mês. Se os dados foram dados a um salão, encaminhamos-lhe também o seu pedido. Pode ainda apresentar queixa à Comissão Nacional de Proteção de Dados, CNPD (www.cnpd.pt), ou à autoridade de proteção de dados do país onde vive, como a AEPD em Espanha (www.aepd.es), a CNIL em França (www.cnil.fr), o Garante em Itália (www.garanteprivacy.it) ou a Data Protection Commission na Irlanda (www.dataprotection.ie).`,
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
  if (locale === "pl") return termsPl();
  if (locale === "cs") return termsCs();
  if (locale === "sk") return termsSk();
  if (locale === "hu") return termsHu();
  if (locale === "sl") return termsSl();
  if (locale === "hr") return termsHr();
  if (locale === "ro") return termsRo();
  if (locale === "bg") return termsBg();
  if (locale === "da") return termsDa();
  if (locale === "sv") return termsSv();
  if (locale === "nb") return termsNb();
  if (locale === "fi") return termsFi();
  if (locale === "et") return termsEt();
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
    updated: "Dernière mise à jour : 1er novembre 2026",
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
          `Vous pouvez demander l'accès à vos données, leur rectification ou leur effacement, la limitation du traitement ou vous y opposer, et les recevoir dans un format portable. Écrivez à ${o.email} ; nous répondons dans un délai d'un mois. Si les données ont été communiquées à un salon, nous lui transmettons aussi votre demande. Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr) en France, de l'Autorité de protection des données (www.autoriteprotectiondonnees.be) en Belgique, de la CNPD (www.cnpd.lu) au Luxembourg, du PFPDT (www.edoeb.admin.ch) en Suisse ou de l'autorité portugaise, la CNPD (www.cnpd.pt).`,
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
    updated: "Ultimo aggiornamento: 1° novembre 2026",
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
          `Puoi chiedere l'accesso, la rettifica o la cancellazione dei tuoi dati, la limitazione del trattamento o opporti a esso, e riceverli in un formato portabile. Scrivi a ${o.email}; rispondiamo entro un mese. Se i dati sono stati forniti a un salone, gli inoltriamo anche la tua richiesta. Puoi inoltre proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it) in Italia, all'IFPDT (www.edoeb.admin.ch) in Svizzera o all'autorità portoghese, la CNPD (www.cnpd.pt).`,
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
    updated: "Stand: 1. November 2026",
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
          `Sie können Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen, die Einschränkung der Verarbeitung oder Widerspruch dagegen, und Ihre Daten in einem übertragbaren Format erhalten. Schreiben Sie an ${o.email}; wir antworten innerhalb eines Monats. Wurden die Daten einem Salon übermittelt, leiten wir Ihre Anfrage auch an ihn weiter. Sie können sich außerdem bei der Datenschutzaufsichtsbehörde Ihres Bundeslandes, in Belgien bei der Datenschutzbehörde (www.datenschutzbehorde.be), in Luxemburg bei der CNPD (www.cnpd.lu), in Österreich bei der Datenschutzbehörde (www.dsb.gv.at), in der Schweiz beim EDÖB (www.edoeb.admin.ch), oder bei der portugiesischen Behörde CNPD (www.cnpd.pt) beschweren.`,
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
    updated: "Laatst bijgewerkt: 29 oktober 2026",
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
          `Je kunt vragen om inzage, correctie of verwijdering van je gegevens, om beperking van of bezwaar tegen de verwerking, en om je gegevens in een overdraagbaar formaat te ontvangen. Schrijf naar ${o.email}; we antwoorden binnen een maand. Zijn de gegevens aan een salon gegeven, dan sturen we je verzoek ook aan die salon door. Je kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens (www.autoriteitpersoonsgegevens.nl) in Nederland, de Gegevensbeschermingsautoriteit (www.gegevensbeschermingsautoriteit.be) in België of bij de Portugese toezichthouder CNPD (www.cnpd.pt).`,
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

function privacyPl(): LegalDoc {
  const o = operator();
  return {
    title: "Polityka prywatności",
    updated: "Ostatnia aktualizacja: 1 listopada 2026",
    intro:
      "Astrabela to katalog salonów kosmetycznych, barberów i restauracji w Europie, z rezerwacją online i opiniami klientów o każdym specjaliście. Ta polityka wyjaśnia, jakie dane osobowe przetwarzamy, w jakim celu i jakie masz prawa zgodnie z RODO.",
    sections: [
      { title: "1. Kim jesteśmy", body: [`Serwis astrabela.com prowadzi ${who()}. Pytania dotyczące Twoich danych wyślij na adres ${o.email}.`] },
      {
        title: "2. Jakie dane przetwarzamy",
        body: [
          "Gdy rezerwujesz lub wystawiasz opinię (klienci):",
          [
            "imię, e-mail i numer komórkowy podane przy rezerwacji oraz Twoja wiadomość do salonu;",
            "sama rezerwacja: salon, specjalista, usługa, data, godzina i status;",
            "Twoja opinia: gwiazdki, tekst i imię, które chcesz pokazać;",
            "jeśli zakładasz konto klienta: imię i e-mail oraz hasło przechowywane wyłącznie w postaci zaszyfrowanej (hash) albo, przy logowaniu przez Google, identyfikator Twojego konta Google (Twojego hasła Google nigdy nie widzimy).",
          ],
          "Gdy salon lub restauracja korzysta z Astrabeli (firmy):",
          [
            "imię i e-mail właściciela konta oraz hasło (przechowywane wyłącznie zaszyfrowane);",
            "dane firmy: nazwa, adres, telefon, e-mail, numer podatkowy, zespół, usługi, ceny, godziny otwarcia, menu i linki do mediów społecznościowych.",
          ],
          "Dane techniczne: pliki cookie sesji zalogowanych kont, plik cookie języka oraz logi serwera (np. adres IP i czas zapytania), przechowywane ze względów bezpieczeństwa.",
        ],
      },
      {
        title: "3. Cele i podstawy prawne",
        body: [
          [
            "realizacja i obsługa rezerwacji: wykonanie umowy (art. 6 ust. 1 lit. b RODO);",
            "obsługa kont i subskrypcji firm: wykonanie umowy;",
            "publikowanie opinii i zapobieganie fałszywym opiniom: prawnie uzasadniony interes w wiarygodnym katalogu (art. 6 ust. 1 lit. f);",
            "bezpieczne działanie serwisu: prawnie uzasadniony interes;",
            "obowiązki podatkowe i księgowe: obowiązek prawny (art. 6 ust. 1 lit. c).",
          ],
          "Nie sprzedajemy danych osobowych i nie wykorzystujemy ich do reklam.",
        ],
      },
      {
        title: "4. Rola salonu i nasza",
        body: [
          "Przy rezerwacjach to wybrany przez Ciebie salon decyduje, jak wykorzystuje dane swoich klientów, i jest ich administratorem. Astrabela przetwarza te dane w imieniu salonu jako podmiot przetwarzający (art. 28 RODO) i wyłącznie w celu świadczenia usługi. Za opinie, publiczny katalog i bezpieczeństwo serwisu administratorem jest Astrabela.",
        ],
      },
      {
        title: "5. Odbiorcy danych",
        body: [
          "Salon lub restauracja, w której rezerwujesz. Korzystamy też z następujących dostawców, związanych umowami powierzenia przetwarzania danych:",
          [
            "Vercel Inc. – hosting; serwis działa we Frankfurcie (UE). Vercel to firma amerykańska; przekazywanie danych poza UE zabezpieczają standardowe klauzule umowne UE oraz EU-US Data Privacy Framework;",
            "Neon – baza danych przechowywana we Frankfurcie (UE);",
            "Cloudflare – usługa nazw domen (DNS);",
            "Google – tylko jeśli logujesz się przez Google.",
          ],
        ],
      },
      {
        title: "6. Okres przechowywania",
        body: [
          [
            "dane klientów i rezerwacji: dopóki konto salonu jest aktywne i nie dłużej niż 2 lata od Twojej ostatniej wizyty;",
            "opinie: dopóki salon jest na Astrabeli;",
            "konta klientów: do czasu ich usunięcia (przycisk na stronie konta);",
            "konta firm: do zamknięcia konta;",
            "faktury i dane rozliczeniowe: 10 lat, zgodnie z portugalskim prawem podatkowym;",
            "sesje logowania firm: 30 dni.",
          ],
        ],
      },
      {
        title: "7. Pliki cookie",
        body: [
          "Używamy wyłącznie plików cookie niezbędnych do działania serwisu: utrzymujących zalogowanie (i pokazujących Twoje imię w menu), krótkotrwałych podczas logowania przez Google, jednego dla języka i jednego, który zapamiętuje dania polubione w menu restauracji (powstaje dopiero po dotknięciu ♥ i zawiera losowy kod, nie Twoje imię). Nie używamy analitycznych ani reklamowych plików cookie, dlatego nie prosimy o zgodę na cookie.",
        ],
      },
      {
        title: "8. Twoje prawa",
        body: [
          `Możesz żądać dostępu do swoich danych, ich sprostowania lub usunięcia, ograniczenia przetwarzania lub wnieść sprzeciw oraz otrzymać dane w formacie umożliwiającym ich przeniesienie. Napisz na ${o.email}; odpowiadamy w ciągu miesiąca. Jeśli dane zostały przekazane salonowi, przekażemy mu również Twoje żądanie. Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (www.uodo.gov.pl) lub do portugalskiego organu CNPD (www.cnpd.pt).`,
        ],
      },
      {
        title: "9. Bezpieczeństwo",
        body: [
          "Serwis działa wyłącznie przez HTTPS, hasła są przechowywane w postaci zaszyfrowanej, a linki do rezerwacji i opinii są osobiste i trudne do odgadnięcia. Nie udostępniaj innym swojego osobistego linku.",
        ],
      },
      {
        title: "10. Zmiany",
        body: ["Jeśli zmienimy tę politykę, opublikujemy tu nową wersję z datą. O ważnych zmianach poinformujemy w serwisie."],
      },
    ],
  };
}

function termsPl(): LegalDoc {
  const o = operator();
  return {
    title: "Regulamin",
    updated: "Ostatnia aktualizacja: 1 listopada 2026",
    intro: `Ten regulamin określa zasady korzystania z astrabela.com, prowadzonego przez ${who()}. Korzystając z serwisu lub zakładając konto firmy, akceptujesz go.`,
    sections: [
      {
        title: "1. Usługa",
        body: [
          "Astrabela pozwala klientom znaleźć salony kosmetyczne, barberów i restauracje, rezerwować usługi online, oceniać specjalistów i przeglądać menu restauracji. Salony i restauracje zarządzają profilem, zespołem, usługami, kalendarzem i menu w swoim koncie firmy.",
        ],
      },
      {
        title: "2. Dla klientów",
        body: [
          [
            "Korzystanie z Astrabeli jest bezpłatne i nie wymaga konta.",
            "Rezerwacja to umowa między Tobą a salonem. Usługi, ceny i czas trwania ustala salon, a usługę wykonuje salon, nie Astrabela.",
            "Astrabela nie przyjmuje płatności: płacisz bezpośrednio w salonie.",
            "Możesz odwołać wizytę przez otrzymany osobisty link. Odwołaj ją, jeśli nie możesz przyjść.",
          ],
        ],
      },
      {
        title: "3. Opinie",
        body: [
          "Każdy klient zalogowany na Astrabeli może ocenić specjalistę salonu, raz na 30 dni dla danego specjalisty. Klienci z wizytą zarezerwowaną przez Astrabelę lub potwierdzoną przez salon mogą też wystawić opinię przez osobisty link; takie opinie mają oznaczenie potwierdzonej wizyty. Opinia musi:",
          [
            "opisywać Twoje własne, prawdziwe doświadczenie;",
            "być wolna od obraźliwych treści, gróźb i dyskryminacji;",
            "nie zawierać danych osobowych innych osób, reklam ani linków.",
          ],
          "Możemy ukryć opinie naruszające te zasady. Salon nie może usuwać ani zmieniać opinii; może odpowiedzieć publicznie lub zgłosić opinię do moderacji.",
        ],
      },
      {
        title: "4. Dla salonów i restauracji",
        body: [
          [
            "Dane profilu, ceny i menu muszą być prawdziwe i aktualne. Odpowiadasz za nie i za swoje usługi.",
            "Chroń swoje hasło; odpowiadasz za działania na swoim koncie.",
            "Nie twórz fałszywych rezerwacji, opinii ani próśb o opinie i nie proś o opinie w zamian za nagrodę.",
            "W wyszukiwaniu pojawiają się tylko profile z aktywną subskrypcją lub w okresie bezpłatnym.",
          ],
        ],
      },
      {
        title: "5. Ceny",
        body: [
          "Dla salonów, barberów i restauracji pierwsze 3 miesiące są bezpłatne, bez karty na start. Potem do bycia widocznym potrzebna jest subskrypcja:",
          PRICES.pl,
          "Warunki płatności są pokazywane przed każdym obciążeniem. Możemy zmienić ceny z co najmniej 30-dniowym wyprzedzeniem; zmiana obowiązuje od następnego okresu rozliczeniowego.",
        ],
      },
      {
        title: "6. Umowa powierzenia przetwarzania danych (firmy)",
        body: [
          "W odniesieniu do danych klientów w rezerwacjach firma jest administratorem, a Astrabela podmiotem przetwarzającym (art. 28 RODO). Astrabela:",
          [
            "przetwarza te dane wyłącznie w celu świadczenia usługi i zgodnie z poleceniami, które firma wydaje przez serwis;",
            "zachowuje je w poufności i chroni odpowiednimi środkami bezpieczeństwa;",
            "korzysta tylko z podprocesorów wymienionych w polityce prywatności i informuje firmy przed dodaniem nowych;",
            "pomaga firmie przy żądaniach klientów i zgłaszaniu naruszeń ochrony danych;",
            "po zamknięciu konta usuwa lub przekazuje dane, chyba że prawo wymaga ich przechowywania.",
          ],
        ],
      },
      {
        title: "7. Zawieszenie i zamknięcie konta",
        body: [
          "Możesz w każdej chwili zamknąć konto firmy, pisząc do nas. Możemy zawiesić lub usunąć profil naruszający ten regulamin, prawo lub prawa innych osób, podając powód.",
        ],
      },
      {
        title: "8. Odpowiedzialność",
        body: [
          "Staramy się, aby serwis był dostępny i poprawny, ale nie możemy zagwarantować, że zawsze będzie działał bez przerw i błędów. Astrabela nie jest stroną umowy między klientem a salonem i nie odpowiada za usługi salonów. Nic w tym regulaminie nie ogranicza ustawowych praw konsumentów.",
        ],
      },
      {
        title: "9. Prawo właściwe i reklamacje",
        body: [
          `Regulamin podlega prawu portugalskiemu, bez uszczerbku dla ochrony, jaką zapewnia Ci jako konsumentowi prawo kraju Twojego zamieszkania. Reklamacje wyślij na ${o.email}.`,
        ],
      },
      {
        title: "10. Zmiany",
        body: ["Możemy aktualizować ten regulamin. Nowa wersja zostanie opublikowana tutaj z datą; o ważnych zmianach firmy informujemy z wyprzedzeniem."],
      },
    ],
  };
}

function privacyCs(): LegalDoc {
  const o = operator();
  return {
    title: "Zásady ochrany soukromí",
    updated: "Poslední aktualizace: 1. listopadu 2026",
    intro:
      "Astrabela je katalog kosmetických salonů, barbershopů a restaurací v Evropě s online rezervací a hodnocením klientů u každého specialisty. Tyto zásady vysvětlují, jaké osobní údaje zpracováváme, za jakým účelem a jaká máte práva podle GDPR.",
    sections: [
      { title: "1. Kdo jsme", body: [`Službu astrabela.com provozuje ${who()}. Dotazy k vašim údajům posílejte na ${o.email}.`] },
      {
        title: "2. Jaké údaje zpracováváme",
        body: [
          "Když rezervujete nebo hodnotíte (klienti):",
          [
            "jméno, e-mail a číslo mobilu zadané při rezervaci a vaše zpráva salonu;",
            "samotná rezervace: salon, specialista, služba, datum, čas a stav;",
            "vaše hodnocení: hvězdičky, text a jméno, které chcete zobrazit;",
            "pokud si vytvoříte klientský účet: jméno a e-mail a heslo uložené pouze v zašifrované podobě (hash), nebo při přihlášení přes Google identifikátor vašeho účtu Google (vaše heslo Google nikdy nevidíme).",
          ],
          "Když salon nebo restaurace používá Astrabelu (firmy):",
          [
            "jméno a e-mail majitele účtu a heslo (uložené pouze zašifrované);",
            "údaje o firmě: název, adresa, telefon, e-mail, daňové číslo, tým, služby, ceny, otevírací doba, menu a odkazy na sociální sítě.",
          ],
          "Technické údaje: soubory cookie přihlášení, soubor cookie jazyka a serverové záznamy (např. IP adresa a čas požadavku), uchovávané z bezpečnostních důvodů.",
        ],
      },
      {
        title: "3. Účely a právní základy",
        body: [
          [
            "vyřízení a správa rezervací: plnění smlouvy (čl. 6 odst. 1 písm. b GDPR);",
            "správa účtů a předplatného firem: plnění smlouvy;",
            "zveřejňování hodnocení a prevence falešných hodnocení: oprávněný zájem na důvěryhodném katalogu (čl. 6 odst. 1 písm. f);",
            "bezpečný provoz služby: oprávněný zájem;",
            "daňové a účetní povinnosti: právní povinnost (čl. 6 odst. 1 písm. c).",
          ],
          "Osobní údaje neprodáváme a nepoužíváme je k reklamě.",
        ],
      },
      {
        title: "4. Role salonu a naše role",
        body: [
          "U rezervací rozhoduje o použití údajů svých klientů salon, který si vyberete, a je jejich správcem. Astrabela tyto údaje zpracovává jménem salonu jako zpracovatel (čl. 28 GDPR) a pouze za účelem poskytování služby. Za hodnocení, veřejný katalog a bezpečnost služby je správcem Astrabela.",
        ],
      },
      {
        title: "5. Příjemci údajů",
        body: [
          "Salon nebo restaurace, kde rezervujete. Dále využíváme tyto poskytovatele, vázané smlouvami o zpracování údajů:",
          [
            "Vercel Inc. – hosting; služba běží ve Frankfurtu (EU). Vercel je americká společnost; předávání údajů mimo EU zajišťují standardní smluvní doložky EU a rámec EU-US Data Privacy Framework;",
            "Neon – databáze uložená ve Frankfurtu (EU);",
            "Cloudflare – služba doménových jmen (DNS);",
            "Google – pouze pokud se přihlašujete přes Google.",
          ],
        ],
      },
      {
        title: "6. Doba uchování",
        body: [
          [
            "údaje klientů a rezervací: dokud je účet salonu aktivní, nejdéle 2 roky od vaší poslední návštěvy;",
            "hodnocení: dokud je salon na Astrabele;",
            "klientské účty: do jejich smazání (tlačítko na stránce účtu);",
            "firemní účty: do zrušení účtu;",
            "faktury a platební údaje: 10 let podle portugalského daňového práva;",
            "přihlášení firem: 30 dnů.",
          ],
        ],
      },
      {
        title: "7. Soubory cookie",
        body: [
          "Používáme pouze soubory cookie nezbytné pro provoz služby: pro udržení přihlášení (a zobrazení vašeho jména v menu), krátkodobé při přihlášení přes Google, jeden pro jazyk a jeden, který si pamatuje jídla, která se vám líbí v menu restaurace (vzniká až po klepnutí na ♥ a obsahuje náhodný kód, ne vaše jméno). Analytické ani reklamní soubory cookie nepoužíváme, proto nežádáme o souhlas s cookie.",
        ],
      },
      {
        title: "8. Vaše práva",
        body: [
          `Můžete požádat o přístup ke svým údajům, jejich opravu nebo výmaz, omezení zpracování nebo vznést námitku a získat údaje ve formátu vhodném pro přenos. Napište na ${o.email}; odpovíme do jednoho měsíce. Pokud byly údaje předány salonu, předáme mu i vaši žádost. Můžete také podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.gov.cz) nebo u portugalského úřadu CNPD (www.cnpd.pt).`,
        ],
      },
      {
        title: "9. Bezpečnost",
        body: [
          "Služba běží pouze přes HTTPS, hesla jsou uložena zašifrovaná a odkazy na rezervace a hodnocení jsou osobní a těžko uhodnutelné. Svůj osobní odkaz s nikým nesdílejte.",
        ],
      },
      {
        title: "10. Změny",
        body: ["Pokud tyto zásady změníme, zveřejníme zde novou verzi s datem. O důležitých změnách vás informujeme ve službě."],
      },
    ],
  };
}

function termsCs(): LegalDoc {
  const o = operator();
  return {
    title: "Obchodní podmínky",
    updated: "Poslední aktualizace: 1. listopadu 2026",
    intro: `Tyto podmínky upravují používání astrabela.com, kterou provozuje ${who()}. Používáním služby nebo vytvořením firemního účtu je přijímáte.`,
    sections: [
      {
        title: "1. Služba",
        body: [
          "Astrabela umožňuje klientům najít kosmetické salony, barbershopy a restaurace, rezervovat služby online, hodnotit specialisty a prohlížet menu restaurací. Salony a restaurace spravují profil, tým, služby, kalendář a menu ve svém firemním účtu.",
        ],
      },
      {
        title: "2. Pro klienty",
        body: [
          [
            "Používání Astrabely je zdarma a nevyžaduje účet.",
            "Rezervace je smlouva mezi vámi a salonem. Služby, ceny a délku určuje salon a službu poskytuje salon, ne Astrabela.",
            "Astrabela nepřijímá platby: platíte přímo v salonu.",
            "Návštěvu můžete zrušit přes osobní odkaz, který dostanete. Zrušte ji, pokud nemůžete přijít.",
          ],
        ],
      },
      {
        title: "3. Hodnocení",
        body: [
          "Každý klient přihlášený na Astrabele může ohodnotit specialistu salonu, jednou za 30 dnů u téhož specialisty. Klienti s návštěvou rezervovanou přes Astrabelu nebo potvrzenou salonem mohou hodnotit také přes osobní odkaz; tato hodnocení mají označení potvrzené návštěvy. Hodnocení musí:",
          [
            "popisovat vaši vlastní skutečnou zkušenost;",
            "být bez urážek, výhrůžek a diskriminace;",
            "neobsahovat osobní údaje jiných lidí, reklamu ani odkazy.",
          ],
          "Hodnocení porušující tato pravidla můžeme skrýt. Salon nemůže hodnocení mazat ani měnit; může veřejně odpovědět nebo hodnocení nahlásit k moderaci.",
        ],
      },
      {
        title: "4. Pro salony a restaurace",
        body: [
          [
            "Údaje v profilu, ceny a menu musí být pravdivé a aktuální. Odpovídáte za ně i za své služby.",
            "Chraňte své heslo; odpovídáte za činnost ve svém účtu.",
            "Nevytvářejte falešné rezervace, hodnocení ani žádosti o hodnocení a nežádejte o hodnocení výměnou za odměnu.",
            "Ve vyhledávání se zobrazují pouze profily s aktivním předplatným nebo ve zkušebním období.",
          ],
        ],
      },
      {
        title: "5. Ceny",
        body: [
          "Pro salony, barbershopy a restaurace jsou první 3 měsíce zdarma, bez karty na začátek. Poté je pro zobrazení potřeba předplatné:",
          PRICES.cs,
          "Platební podmínky se zobrazí před každou platbou. Ceny můžeme změnit s alespoň 30denním předstihem; změna platí od dalšího zúčtovacího období.",
        ],
      },
      {
        title: "6. Smlouva o zpracování osobních údajů (firmy)",
        body: [
          "U údajů klientů v rezervacích je firma správcem a Astrabela zpracovatelem (čl. 28 GDPR). Astrabela:",
          [
            "zpracovává tyto údaje pouze za účelem poskytování služby a podle pokynů, které firma dává prostřednictvím služby;",
            "zachovává jejich důvěrnost a chrání je přiměřenými bezpečnostními opatřeními;",
            "využívá pouze dílčí zpracovatele uvedené v zásadách ochrany soukromí a o nových firmy předem informuje;",
            "pomáhá firmě s žádostmi klientů a s hlášením porušení zabezpečení údajů;",
            "po zrušení účtu údaje smaže nebo předá, pokud zákon nevyžaduje jejich uchování.",
          ],
        ],
      },
      {
        title: "7. Pozastavení a zrušení účtu",
        body: [
          "Firemní účet můžete kdykoli zrušit tím, že nám napíšete. Profil porušující tyto podmínky, zákon nebo práva jiných můžeme pozastavit nebo odstranit, s uvedením důvodu.",
        ],
      },
      {
        title: "8. Odpovědnost",
        body: [
          "Snažíme se, aby služba byla dostupná a správná, ale nemůžeme zaručit, že bude vždy fungovat bez přerušení a chyb. Astrabela není stranou smlouvy mezi klientem a salonem a neodpovídá za služby salonů. Nic v těchto podmínkách neomezuje zákonná práva spotřebitelů.",
        ],
      },
      {
        title: "9. Rozhodné právo a stížnosti",
        body: [
          `Podmínky se řídí portugalským právem, aniž by tím byla dotčena ochrana, kterou vám jako spotřebiteli poskytuje právo země vašeho bydliště. Stížnosti posílejte na ${o.email}.`,
        ],
      },
      {
        title: "10. Změny",
        body: ["Tyto podmínky můžeme aktualizovat. Nová verze bude zveřejněna zde s datem; o důležitých změnách informujeme firmy předem."],
      },
    ],
  };
}

function privacySk(): LegalDoc {
  const o = operator();
  return {
    title: "Zásady ochrany súkromia",
    updated: "Posledná aktualizácia: 1. novembra 2026",
    intro:
      "Astrabela je katalóg kozmetických salónov, barbershopov a reštaurácií v Európe s online rezerváciou a hodnoteniami klientov pri každom špecialistovi. Tieto zásady vysvetľujú, aké osobné údaje spracúvame, na aký účel a aké máte práva podľa GDPR.",
    sections: [
      { title: "1. Kto sme", body: [`Službu astrabela.com prevádzkuje ${who()}. Otázky k vašim údajom posielajte na ${o.email}.`] },
      {
        title: "2. Aké údaje spracúvame",
        body: [
          "Keď rezervujete alebo hodnotíte (klienti):",
          [
            "meno, e-mail a číslo mobilu zadané pri rezervácii a vaša správa salónu;",
            "samotná rezervácia: salón, špecialista, služba, dátum, čas a stav;",
            "vaše hodnotenie: hviezdičky, text a meno, ktoré chcete zobraziť;",
            "ak si vytvoríte klientsky účet: meno a e-mail a heslo uložené iba v zašifrovanej podobe (hash), alebo pri prihlásení cez Google identifikátor vášho účtu Google (vaše heslo Google nikdy nevidíme).",
          ],
          "Keď salón alebo reštaurácia používa Astrabelu (firmy):",
          [
            "meno a e-mail majiteľa účtu a heslo (uložené iba zašifrované);",
            "údaje o firme: názov, adresa, telefón, e-mail, daňové číslo, tím, služby, ceny, otváracie hodiny, menu a odkazy na sociálne siete.",
          ],
          "Technické údaje: súbory cookie prihlásenia, súbor cookie jazyka a serverové záznamy (napr. IP adresa a čas požiadavky), uchovávané z bezpečnostných dôvodov.",
        ],
      },
      {
        title: "3. Účely a právne základy",
        body: [
          [
            "vybavenie a správa rezervácií: plnenie zmluvy (čl. 6 ods. 1 písm. b GDPR);",
            "správa účtov a predplatného firiem: plnenie zmluvy;",
            "zverejňovanie hodnotení a prevencia falošných hodnotení: oprávnený záujem na dôveryhodnom katalógu (čl. 6 ods. 1 písm. f);",
            "bezpečná prevádzka služby: oprávnený záujem;",
            "daňové a účtovné povinnosti: zákonná povinnosť (čl. 6 ods. 1 písm. c).",
          ],
          "Osobné údaje nepredávame a nepoužívame ich na reklamu.",
        ],
      },
      {
        title: "4. Úloha salónu a naša úloha",
        body: [
          "Pri rezerváciách rozhoduje o použití údajov svojich klientov salón, ktorý si vyberiete, a je ich prevádzkovateľom. Astrabela tieto údaje spracúva v mene salónu ako sprostredkovateľ (čl. 28 GDPR) a iba na účel poskytovania služby. Za hodnotenia, verejný katalóg a bezpečnosť služby je prevádzkovateľom Astrabela.",
        ],
      },
      {
        title: "5. Príjemcovia údajov",
        body: [
          "Salón alebo reštaurácia, kde rezervujete. Ďalej využívame týchto poskytovateľov, viazaných zmluvami o spracúvaní údajov:",
          [
            "Vercel Inc. – hosting; služba beží vo Frankfurte (EÚ). Vercel je americká spoločnosť; prenos údajov mimo EÚ zabezpečujú štandardné zmluvné doložky EÚ a rámec EU-US Data Privacy Framework;",
            "Neon – databáza uložená vo Frankfurte (EÚ);",
            "Cloudflare – služba doménových mien (DNS);",
            "Google – iba ak sa prihlasujete cez Google.",
          ],
        ],
      },
      {
        title: "6. Doba uchovávania",
        body: [
          [
            "údaje klientov a rezervácií: kým je účet salónu aktívny, najdlhšie 2 roky od vašej poslednej návštevy;",
            "hodnotenia: kým je salón na Astrabele;",
            "klientske účty: do ich zmazania (tlačidlo na stránke účtu);",
            "firemné účty: do zrušenia účtu;",
            "faktúry a platobné údaje: 10 rokov podľa portugalského daňového práva;",
            "prihlásenia firiem: 30 dní.",
          ],
        ],
      },
      {
        title: "7. Súbory cookie",
        body: [
          "Používame iba súbory cookie nevyhnutné na prevádzku služby: na udržanie prihlásenia (a zobrazenie vášho mena v menu), krátkodobé pri prihlásení cez Google, jeden pre jazyk a jeden, ktorý si pamätá jedlá, ktoré sa vám páčia v menu reštaurácie (vzniká až po ťuknutí na ♥ a obsahuje náhodný kód, nie vaše meno). Analytické ani reklamné súbory cookie nepoužívame, preto nežiadame o súhlas s cookie.",
        ],
      },
      {
        title: "8. Vaše práva",
        body: [
          `Môžete požiadať o prístup k svojim údajom, ich opravu alebo vymazanie, obmedzenie spracúvania alebo namietať a získať údaje vo formáte vhodnom na prenos. Napíšte na ${o.email}; odpovieme do jedného mesiaca. Ak boli údaje odovzdané salónu, odovzdáme mu aj vašu žiadosť. Môžete tiež podať sťažnosť Úradu na ochranu osobných údajov SR (www.dataprotection.gov.sk) alebo portugalskému úradu CNPD (www.cnpd.pt).`,
        ],
      },
      {
        title: "9. Bezpečnosť",
        body: [
          "Služba beží iba cez HTTPS, heslá sú uložené zašifrované a odkazy na rezervácie a hodnotenia sú osobné a ťažko uhádnuteľné. Svoj osobný odkaz s nikým nezdieľajte.",
        ],
      },
      {
        title: "10. Zmeny",
        body: ["Ak tieto zásady zmeníme, zverejníme tu novú verziu s dátumom. O dôležitých zmenách vás budeme informovať v službe."],
      },
    ],
  };
}

function termsSk(): LegalDoc {
  const o = operator();
  return {
    title: "Obchodné podmienky",
    updated: "Posledná aktualizácia: 1. novembra 2026",
    intro: `Tieto podmienky upravujú používanie astrabela.com, ktorú prevádzkuje ${who()}. Používaním služby alebo vytvorením firemného účtu ich prijímate.`,
    sections: [
      {
        title: "1. Služba",
        body: [
          "Astrabela umožňuje klientom nájsť kozmetické salóny, barbershopy a reštaurácie, rezervovať služby online, hodnotiť špecialistov a prezerať menu reštaurácií. Salóny a reštaurácie spravujú profil, tím, služby, kalendár a menu vo svojom firemnom účte.",
        ],
      },
      {
        title: "2. Pre klientov",
        body: [
          [
            "Používanie Astrabely je zadarmo a nevyžaduje účet.",
            "Rezervácia je zmluva medzi vami a salónom. Služby, ceny a trvanie určuje salón a službu poskytuje salón, nie Astrabela.",
            "Astrabela neprijíma platby: platíte priamo v salóne.",
            "Návštevu môžete zrušiť cez osobný odkaz, ktorý dostanete. Zrušte ju, ak nemôžete prísť.",
          ],
        ],
      },
      {
        title: "3. Hodnotenia",
        body: [
          "Každý klient prihlásený na Astrabele môže ohodnotiť špecialistu salónu, raz za 30 dní pri tom istom špecialistovi. Klienti s návštevou rezervovanou cez Astrabelu alebo potvrdenou salónom môžu hodnotiť aj cez osobný odkaz; tieto hodnotenia majú označenie potvrdenej návštevy. Hodnotenie musí:",
          [
            "opisovať vašu vlastnú skutočnú skúsenosť;",
            "byť bez urážok, vyhrážok a diskriminácie;",
            "neobsahovať osobné údaje iných ľudí, reklamu ani odkazy.",
          ],
          "Hodnotenia porušujúce tieto pravidlá môžeme skryť. Salón nemôže hodnotenia mazať ani meniť; môže verejne odpovedať alebo hodnotenie nahlásiť na moderáciu.",
        ],
      },
      {
        title: "4. Pre salóny a reštaurácie",
        body: [
          [
            "Údaje v profile, ceny a menu musia byť pravdivé a aktuálne. Zodpovedáte za ne aj za svoje služby.",
            "Chráňte svoje heslo; zodpovedáte za činnosť vo svojom účte.",
            "Nevytvárajte falošné rezervácie, hodnotenia ani žiadosti o hodnotenie a nežiadajte o hodnotenia výmenou za odmenu.",
            "Vo vyhľadávaní sa zobrazujú iba profily s aktívnym predplatným alebo v skúšobnom období.",
          ],
        ],
      },
      {
        title: "5. Ceny",
        body: [
          "Pre salóny, barbershopy a reštaurácie sú prvé 3 mesiace zadarmo, bez karty na začiatok. Potom je na zobrazenie potrebné predplatné:",
          PRICES.sk,
          "Platobné podmienky sa zobrazia pred každou platbou. Ceny môžeme zmeniť s aspoň 30-dňovým predstihom; zmena platí od ďalšieho zúčtovacieho obdobia.",
        ],
      },
      {
        title: "6. Zmluva o spracúvaní osobných údajov (firmy)",
        body: [
          "Pri údajoch klientov v rezerváciách je firma prevádzkovateľom a Astrabela sprostredkovateľom (čl. 28 GDPR). Astrabela:",
          [
            "spracúva tieto údaje iba na účel poskytovania služby a podľa pokynov, ktoré firma dáva prostredníctvom služby;",
            "zachováva ich dôvernosť a chráni ich primeranými bezpečnostnými opatreniami;",
            "využíva iba ďalších sprostredkovateľov uvedených v zásadách ochrany súkromia a o nových firmy vopred informuje;",
            "pomáha firme so žiadosťami klientov a s ohlasovaním porušenia ochrany údajov;",
            "po zrušení účtu údaje vymaže alebo odovzdá, ak zákon nevyžaduje ich uchovanie.",
          ],
        ],
      },
      {
        title: "7. Pozastavenie a zrušenie účtu",
        body: [
          "Firemný účet môžete kedykoľvek zrušiť tak, že nám napíšete. Profil porušujúci tieto podmienky, zákon alebo práva iných môžeme pozastaviť alebo odstrániť, s uvedením dôvodu.",
        ],
      },
      {
        title: "8. Zodpovednosť",
        body: [
          "Snažíme sa, aby služba bola dostupná a správna, ale nemôžeme zaručiť, že bude vždy fungovať bez prerušenia a chýb. Astrabela nie je stranou zmluvy medzi klientom a salónom a nezodpovedá za služby salónov. Nič v týchto podmienkach neobmedzuje zákonné práva spotrebiteľov.",
        ],
      },
      {
        title: "9. Rozhodné právo a sťažnosti",
        body: [
          `Podmienky sa riadia portugalským právom bez toho, aby bola dotknutá ochrana, ktorú vám ako spotrebiteľovi poskytuje právo krajiny vášho bydliska. Sťažnosti posielajte na ${o.email}.`,
        ],
      },
      {
        title: "10. Zmeny",
        body: ["Tieto podmienky môžeme aktualizovať. Nová verzia bude zverejnená tu s dátumom; o dôležitých zmenách informujeme firmy vopred."],
      },
    ],
  };
}

function privacyHu(): LegalDoc {
  const o = operator();
  return {
    title: "Adatvédelmi tájékoztató",
    updated: "Utolsó frissítés: 2026. november 1.",
    intro:
      "Az Astrabela európai szépségszalonok, borbélyok és éttermek katalógusa online foglalással és szakemberenkénti vendégértékelésekkel. Ez a tájékoztató elmagyarázza, milyen személyes adatokat kezelünk, milyen célból, és milyen jogaid vannak a GDPR alapján.",
    sections: [
      { title: "1. Kik vagyunk", body: [`Az astrabela.com szolgáltatást ${who()} üzemelteti. Az adataiddal kapcsolatos kérdéseidet a(z) ${o.email} címre küldd.`] },
      {
        title: "2. Milyen adatokat kezelünk",
        body: [
          "Foglaláskor vagy értékeléskor (vendégek):",
          [
            "a foglaláskor megadott név, e-mail-cím és mobilszám, valamint a szalonnak írt üzeneted;",
            "maga a foglalás: szalon, szakember, szolgáltatás, dátum, időpont és állapot;",
            "az értékelésed: csillagok, szöveg és a megjeleníteni kívánt név;",
            "ha vendégfiókot hozol létre: név és e-mail-cím, valamint a jelszó, kizárólag titkosított (hash) formában, vagy Google-belépésnél a Google-fiókod azonosítója (a Google-jelszavadat soha nem látjuk).",
          ],
          "Ha szalon vagy étterem használja az Astrabelát (vállalkozások):",
          [
            "a fióktulajdonos neve, e-mail-címe és jelszava (kizárólag titkosítva tárolva);",
            "a vállalkozás adatai: név, cím, telefon, e-mail, adószám, csapat, szolgáltatások, árak, nyitvatartás, étlap és közösségimédia-linkek.",
          ],
          "Technikai adatok: a belépést fenntartó sütik, egy nyelvi süti és szervernaplók (pl. IP-cím és a kérés időpontja), amelyeket biztonsági okból őrzünk.",
        ],
      },
      {
        title: "3. Célok és jogalapok",
        body: [
          [
            "foglalások teljesítése és kezelése: szerződés teljesítése (GDPR 6. cikk (1) b));",
            "vállalkozói fiókok és előfizetések kezelése: szerződés teljesítése;",
            "értékelések közzététele és a hamis értékelések megelőzése: jogos érdek egy megbízható katalógushoz (6. cikk (1) f));",
            "a szolgáltatás biztonságos működése: jogos érdek;",
            "adózási és számviteli kötelezettségek: jogi kötelezettség (6. cikk (1) c)).",
          ],
          "Személyes adatokat nem adunk el, és nem használunk reklámcélra.",
        ],
      },
      {
        title: "4. A szalon és a mi szerepünk",
        body: [
          "Foglalásoknál a választott szalon dönt arról, hogyan használja vendégei adatait, így ő az adatkezelő. Az Astrabela ezeket az adatokat a szalon nevében, adatfeldolgozóként (GDPR 28. cikk) és kizárólag a szolgáltatás nyújtásához kezeli. Az értékelések, a nyilvános katalógus és a szolgáltatás biztonsága tekintetében az Astrabela az adatkezelő.",
        ],
      },
      {
        title: "5. Az adatok címzettjei",
        body: [
          "A szalon vagy étterem, ahol foglalsz. Emellett az alábbi, adatfeldolgozási szerződéssel kötött szolgáltatókat vesszük igénybe:",
          [
            "Vercel Inc. – tárhely; a szolgáltatás Frankfurtban (EU) fut. A Vercel amerikai cég; az EU-n kívüli adattovábbítást az EU általános szerződési feltételei és az EU–USA adatvédelmi keretrendszer (Data Privacy Framework) biztosítják;",
            "Neon – Frankfurtban (EU) tárolt adatbázis;",
            "Cloudflare – domainnév-szolgáltatás (DNS);",
            "Google – csak ha Google-lel lépsz be.",
          ],
        ],
      },
      {
        title: "6. Megőrzési idő",
        body: [
          [
            "vendég- és foglalási adatok: amíg a szalon fiókja aktív, legfeljebb 2 évig az utolsó látogatásodtól;",
            "értékelések: amíg a szalon az Astrabelán van;",
            "vendégfiókok: törlésükig (gomb a fiók oldalán);",
            "vállalkozói fiókok: a fiók megszüntetéséig;",
            "számlák és számlázási adatok: 10 évig, a portugál adójog szerint;",
            "vállalkozói belépések: 30 nap.",
          ],
        ],
      },
      {
        title: "7. Sütik",
        body: [
          "Csak a működéshez szükséges sütiket használjuk: a belépve maradáshoz (és a neved megjelenítéséhez a menüben), rövid életű sütiket Google-belépéskor, egyet a nyelvhez, és egyet, amely megjegyzi, mely ételek tetszettek az étterem étlapján (csak a ♥ megérintése után jön létre, és véletlenszerű kódot tartalmaz, nem a nevedet). Analitikai vagy reklámsütit nem használunk, ezért nem kérünk sütihozzájárulást.",
        ],
      },
      {
        title: "8. Jogaid",
        body: [
          `Kérheted az adataidhoz való hozzáférést, azok helyesbítését vagy törlését, a kezelés korlátozását, tiltakozhatsz, és hordozható formátumban megkaphatod az adataidat. Írj a(z) ${o.email} címre; egy hónapon belül válaszolunk. Ha az adatokat a szalonnak továbbítottuk, a kérésedet is továbbítjuk neki. Panaszt tehetsz a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (www.naih.hu) vagy a portugál CNPD-nél (www.cnpd.pt) is.`,
        ],
      },
      {
        title: "9. Biztonság",
        body: [
          "A szolgáltatás kizárólag HTTPS-en fut, a jelszavakat titkosítva tároljuk, a foglalási és értékelési linkek pedig személyesek és nehezen kitalálhatók. Ne oszd meg másokkal a személyes linkedet.",
        ],
      },
      {
        title: "10. Változások",
        body: ["Ha módosítjuk ezt a tájékoztatót, itt tesszük közzé az új változatot dátummal. A fontos változásokról a szolgáltatásban értesítünk."],
      },
    ],
  };
}

function termsHu(): LegalDoc {
  const o = operator();
  return {
    title: "Felhasználási feltételek",
    updated: "Utolsó frissítés: 2026. november 1.",
    intro: `Ezek a feltételek az astrabela.com használatát szabályozzák, amelyet ${who()} üzemeltet. A szolgáltatás használatával vagy vállalkozói fiók létrehozásával elfogadod őket.`,
    sections: [
      {
        title: "1. A szolgáltatás",
        body: [
          "Az Astrabelán a vendégek szépségszalonokat, borbélyokat és éttermeket találhatnak, online foglalhatnak, értékelhetik a szakembereket és böngészhetik az éttermek étlapjait. A szalonok és éttermek vállalkozói fiókjukban kezelik a profilt, a csapatot, a szolgáltatásokat, a naptárat és az étlapot.",
        ],
      },
      {
        title: "2. Vendégeknek",
        body: [
          [
            "Az Astrabela használata ingyenes, és nem kell hozzá fiók.",
            "A foglalás közted és a szalon között jön létre. A szolgáltatásokat, árakat és időtartamokat a szalon határozza meg, és a szolgáltatást a szalon nyújtja, nem az Astrabela.",
            "Az Astrabela nem fogad fizetést: közvetlenül a szalonban fizetsz.",
            "A látogatást a kapott személyes linken mondhatod le. Mondd le, ha nem tudsz elmenni.",
          ],
        ],
      },
      {
        title: "3. Értékelések",
        body: [
          "Minden, az Astrabelán belépett vendég értékelheti a szalon egy szakemberét, ugyanazt a szakembert 30 naponta egyszer. Az Astrabelán foglalt vagy a szalon által igazolt látogatással rendelkező vendégek személyes linken is értékelhetnek; ezek az értékelések igazolt látogatás jelölést kapnak. Az értékelésnek:",
          [
            "a saját, valós tapasztalatodat kell leírnia;",
            "sértésektől, fenyegetéstől és megkülönböztetéstől mentesnek kell lennie;",
            "nem tartalmazhat mások személyes adatait, reklámot vagy linkeket.",
          ],
          "Az ezeket a szabályokat megsértő értékeléseket elrejthetjük. A szalon nem törölheti és nem módosíthatja az értékeléseket; nyilvánosan válaszolhat, vagy moderálásra jelentheti az értékelést.",
        ],
      },
      {
        title: "4. Szalonoknak és éttermeknek",
        body: [
          [
            "A profil adatainak, az áraknak és az étlapnak valósnak és naprakésznek kell lenniük. Felelsz értük és a szolgáltatásaidért.",
            "Védd a jelszavadat; felelsz a fiókodban végzett tevékenységért.",
            "Ne hozz létre hamis foglalásokat, értékeléseket vagy értékeléskéréseket, és ne kérj értékelést jutalomért cserébe.",
            "A keresésben csak az aktív előfizetéssel vagy próbaidőszakban lévő profilok jelennek meg.",
          ],
        ],
      },
      {
        title: "5. Árak",
        body: [
          "Szalonok, borbélyok és éttermek számára az első 3 hónap ingyenes, az induláshoz nem kell bankkártya. Utána a megjelenéshez előfizetés szükséges:",
          PRICES.hu,
          "A fizetési feltételeket minden terhelés előtt megmutatjuk. Az árakat legalább 30 nappal előre jelezve módosíthatjuk; a változás a következő számlázási időszaktól érvényes.",
        ],
      },
      {
        title: "6. Adatfeldolgozási megállapodás (vállalkozások)",
        body: [
          "A foglalásokban szereplő vendégadatok tekintetében a vállalkozás az adatkezelő, az Astrabela az adatfeldolgozó (GDPR 28. cikk). Az Astrabela:",
          [
            "ezeket az adatokat kizárólag a szolgáltatás nyújtásához és a vállalkozás által a szolgáltatáson keresztül adott utasítások szerint kezeli;",
            "bizalmasan kezeli őket, és megfelelő biztonsági intézkedésekkel védi;",
            "csak az adatvédelmi tájékoztatóban felsorolt további adatfeldolgozókat veszi igénybe, és újak bevonása előtt tájékoztatja a vállalkozásokat;",
            "segíti a vállalkozást a vendégek kéréseinek és az adatvédelmi incidensek kezelésében;",
            "a fiók megszűnése után törli vagy átadja az adatokat, kivéve, ha jogszabály megőrzést ír elő.",
          ],
        ],
      },
      {
        title: "7. Felfüggesztés és megszüntetés",
        body: [
          "A vállalkozói fiókot bármikor megszüntetheted, ha írsz nekünk. Az ezeket a feltételeket, a jogszabályokat vagy mások jogait sértő profilt indoklással felfüggeszthetjük vagy eltávolíthatjuk.",
        ],
      },
      {
        title: "8. Felelősség",
        body: [
          "Igyekszünk, hogy a szolgáltatás elérhető és pontos legyen, de nem garantálhatjuk, hogy mindig megszakítás és hiba nélkül működik. Az Astrabela nem részese a vendég és a szalon közötti szerződésnek, és nem felel a szalonok szolgáltatásaiért. E feltételek semmi sem korlátozza a fogyasztók törvényes jogait.",
        ],
      },
      {
        title: "9. Irányadó jog és panaszok",
        body: [
          `A feltételekre a portugál jog az irányadó, nem érintve azt a védelmet, amelyet fogyasztóként a lakóhelyed szerinti ország joga biztosít. Panaszaidat a(z) ${o.email} címre küldd.`,
        ],
      },
      {
        title: "10. Változások",
        body: ["Ezeket a feltételeket frissíthetjük. Az új változatot itt tesszük közzé dátummal; a fontos változásokról előre értesítjük a vállalkozásokat."],
      },
    ],
  };
}

function privacySl(): LegalDoc {
  const o = operator();
  return {
    title: "Politika zasebnosti",
    updated: "Zadnja posodobitev: 1. november 2026",
    intro:
      "Astrabela je katalog kozmetičnih salonov, brivnic in restavracij v Evropi s spletno rezervacijo in ocenami strank za vsakega strokovnjaka. Ta politika pojasnjuje, katere osebne podatke obdelujemo, za kaj in kakšne pravice imate po GDPR.",
    sections: [
      { title: "1. Kdo smo", body: [`Storitev astrabela.com upravlja ${who()}. Vprašanja o vaših podatkih pošljite na ${o.email}.`] },
      {
        title: "2. Katere podatke obdelujemo",
        body: [
          "Ko rezervirate ali ocenjujete (stranke):",
          [
            "ime, e-naslov in številka mobilnega telefona, vpisani ob rezervaciji, ter vaše sporočilo salonu;",
            "sama rezervacija: salon, strokovnjak, storitev, datum, ura in stanje;",
            "vaša ocena: zvezdice, besedilo in ime, ki ga želite prikazati;",
            "če ustvarite račun stranke: ime in e-naslov ter geslo, shranjeno le v šifrirani obliki (hash), ali pri prijavi z Googlom identifikator vašega računa Google (vašega gesla Google nikoli ne vidimo).",
          ],
          "Ko salon ali restavracija uporablja Astrabelo (podjetja):",
          [
            "ime in e-naslov lastnika računa ter geslo (shranjeno le šifrirano);",
            "podatki o podjetju: ime, naslov, telefon, e-pošta, davčna številka, ekipa, storitve, cene, delovni čas, jedilnik in povezave do družbenih omrežij.",
          ],
          "Tehnični podatki: piškotki za prijavo, piškotek za jezik in strežniški dnevniki (npr. naslov IP in čas zahteve), ki jih hranimo iz varnostnih razlogov.",
        ],
      },
      {
        title: "3. Nameni in pravne podlage",
        body: [
          [
            "izvedba in upravljanje rezervacij: izvajanje pogodbe (člen 6(1)(b) GDPR);",
            "upravljanje računov in naročnin podjetij: izvajanje pogodbe;",
            "objava ocen in preprečevanje lažnih ocen: zakoniti interes za zanesljiv katalog (člen 6(1)(f));",
            "varno delovanje storitve: zakoniti interes;",
            "davčne in računovodske obveznosti: zakonska obveznost (člen 6(1)(c)).",
          ],
          "Osebnih podatkov ne prodajamo in jih ne uporabljamo za oglaševanje.",
        ],
      },
      {
        title: "4. Vloga salona in naša vloga",
        body: [
          "Pri rezervacijah o uporabi podatkov svojih strank odloča salon, ki ga izberete, in je njihov upravljavec. Astrabela te podatke obdeluje v imenu salona kot obdelovalec (člen 28 GDPR) in le za izvajanje storitve. Za ocene, javni katalog in varnost storitve je upravljavec Astrabela.",
        ],
      },
      {
        title: "5. Prejemniki podatkov",
        body: [
          "Salon ali restavracija, kjer rezervirate. Uporabljamo tudi naslednje ponudnike, vezane s pogodbami o obdelavi podatkov:",
          [
            "Vercel Inc. – gostovanje; storitev deluje v Frankfurtu (EU). Vercel je ameriško podjetje; prenos podatkov iz EU zagotavljajo standardna pogodbena določila EU in okvir EU-US Data Privacy Framework;",
            "Neon – podatkovna baza v Frankfurtu (EU);",
            "Cloudflare – storitev domenskih imen (DNS);",
            "Google – le če se prijavite z Googlom.",
          ],
        ],
      },
      {
        title: "6. Obdobje hrambe",
        body: [
          [
            "podatki strank in rezervacij: dokler je račun salona aktiven, največ 2 leti od vašega zadnjega obiska;",
            "ocene: dokler je salon na Astrabeli;",
            "računi strank: do izbrisa (gumb na strani računa);",
            "računi podjetij: do zaprtja računa;",
            "računi in podatki o obračunu: 10 let po portugalskem davčnem pravu;",
            "prijave podjetij: 30 dni.",
          ],
        ],
      },
      {
        title: "7. Piškotki",
        body: [
          "Uporabljamo le piškotke, nujne za delovanje storitve: za ohranitev prijave (in prikaz vašega imena v meniju), kratkotrajne ob prijavi z Googlom, enega za jezik in enega, ki si zapomni jedi, ki so vam všeč v jedilniku restavracije (nastane šele, ko se dotaknete ♥, in vsebuje naključno kodo, ne vašega imena). Analitičnih ali oglaševalskih piškotkov ne uporabljamo, zato ne prosimo za soglasje za piškotke.",
        ],
      },
      {
        title: "8. Vaše pravice",
        body: [
          `Zahtevate lahko dostop do svojih podatkov, njihov popravek ali izbris, omejitev obdelave, ugovarjate obdelavi in prejmete podatke v prenosljivi obliki. Pišite na ${o.email}; odgovorimo v enem mesecu. Če so bili podatki posredovani salonu, mu posredujemo tudi vašo zahtevo. Pritožbo lahko vložite tudi pri Informacijskem pooblaščencu (www.ip-rs.si) ali pri portugalskem organu CNPD (www.cnpd.pt).`,
        ],
      },
      {
        title: "9. Varnost",
        body: [
          "Storitev deluje le prek HTTPS, gesla so shranjena šifrirano, povezave do rezervacij in ocen pa so osebne in težko uganljive. Svoje osebne povezave ne delite z drugimi.",
        ],
      },
      {
        title: "10. Spremembe",
        body: ["Če to politiko spremenimo, bomo tukaj objavili novo različico z datumom. O pomembnih spremembah vas obvestimo v storitvi."],
      },
    ],
  };
}

function termsSl(): LegalDoc {
  const o = operator();
  return {
    title: "Pogoji uporabe",
    updated: "Zadnja posodobitev: 1. november 2026",
    intro: `Ti pogoji urejajo uporabo astrabela.com, ki jo upravlja ${who()}. Z uporabo storitve ali ustvarjanjem poslovnega računa jih sprejemate.`,
    sections: [
      {
        title: "1. Storitev",
        body: [
          "Astrabela strankam omogoča iskanje kozmetičnih salonov, brivnic in restavracij, spletno rezervacijo storitev, ocenjevanje strokovnjakov in ogled jedilnikov restavracij. Saloni in restavracije v svojem poslovnem računu upravljajo profil, ekipo, storitve, koledar in jedilnik.",
        ],
      },
      {
        title: "2. Za stranke",
        body: [
          [
            "Uporaba Astrabele je brezplačna in ne zahteva računa.",
            "Rezervacija je pogodba med vami in salonom. Storitve, cene in trajanje določa salon, storitev pa izvede salon, ne Astrabela.",
            "Astrabela ne sprejema plačil: plačate neposredno v salonu.",
            "Obisk lahko odpoveste prek osebne povezave, ki jo prejmete. Odpovejte ga, če ne morete priti.",
          ],
        ],
      },
      {
        title: "3. Ocene",
        body: [
          "Vsaka stranka, prijavljena na Astrabeli, lahko oceni strokovnjaka salona, enkrat na 30 dni za istega strokovnjaka. Stranke z obiskom, rezerviranim prek Astrabele ali potrjenim s strani salona, lahko ocenjujejo tudi prek osebne povezave; te ocene imajo oznako potrjenega obiska. Ocena mora:",
          [
            "opisovati vašo lastno, resnično izkušnjo;",
            "biti brez žalitev, groženj in diskriminacije;",
            "ne vsebovati osebnih podatkov drugih, oglasov ali povezav.",
          ],
          "Ocene, ki kršijo ta pravila, lahko skrijemo. Salon ocen ne more brisati ali spreminjati; lahko javno odgovori ali oceno prijavi v moderiranje.",
        ],
      },
      {
        title: "4. Za salone in restavracije",
        body: [
          [
            "Podatki v profilu, cene in jedilnik morajo biti resnični in posodobljeni. Zanje in za svoje storitve odgovarjate vi.",
            "Varujte svoje geslo; odgovarjate za dejavnosti v svojem računu.",
            "Ne ustvarjajte lažnih rezervacij, ocen ali prošenj za oceno in ne prosite za ocene v zameno za nagrado.",
            "V iskanju se prikažejo le profili z aktivno naročnino ali v preizkusnem obdobju.",
          ],
        ],
      },
      {
        title: "5. Cene",
        body: [
          "Za salone, brivnice in restavracije so prvi 3 meseci brezplačni, za začetek brez kartice. Nato je za prikaz potrebna naročnina:",
          PRICES.sl,
          "Plačilni pogoji so prikazani pred vsakim plačilom. Cene lahko spremenimo z vsaj 30-dnevnim obvestilom; sprememba velja od naslednjega obračunskega obdobja.",
        ],
      },
      {
        title: "6. Pogodba o obdelavi osebnih podatkov (podjetja)",
        body: [
          "Za podatke strank v rezervacijah je podjetje upravljavec, Astrabela pa obdelovalec (člen 28 GDPR). Astrabela:",
          [
            "te podatke obdeluje le za izvajanje storitve in po navodilih, ki jih podjetje daje prek storitve;",
            "jih varuje kot zaupne in z ustreznimi varnostnimi ukrepi;",
            "uporablja le podobdelovalce, navedene v politiki zasebnosti, in podjetja vnaprej obvesti o novih;",
            "pomaga podjetju pri zahtevah strank in prijavi kršitev varstva podatkov;",
            "po zaprtju računa podatke izbriše ali preda, razen če zakon zahteva njihovo hrambo.",
          ],
        ],
      },
      {
        title: "7. Začasna ustavitev in zaprtje računa",
        body: [
          "Poslovni račun lahko kadar koli zaprete tako, da nam pišete. Profil, ki krši te pogoje, zakon ali pravice drugih, lahko z obrazložitvijo začasno ustavimo ali odstranimo.",
        ],
      },
      {
        title: "8. Odgovornost",
        body: [
          "Trudimo se, da je storitev dostopna in pravilna, ne moremo pa zagotoviti, da bo vedno delovala brez prekinitev in napak. Astrabela ni stranka pogodbe med stranko in salonom in ne odgovarja za storitve salonov. Nič v teh pogojih ne omejuje zakonskih pravic potrošnikov.",
        ],
      },
      {
        title: "9. Veljavno pravo in pritožbe",
        body: [
          `Za pogoje velja portugalsko pravo, brez poseganja v varstvo, ki vam ga kot potrošniku zagotavlja pravo države vašega prebivališča. Pritožbe pošljite na ${o.email}.`,
        ],
      },
      {
        title: "10. Spremembe",
        body: ["Te pogoje lahko posodobimo. Nova različica bo objavljena tukaj z datumom; o pomembnih spremembah podjetja obvestimo vnaprej."],
      },
    ],
  };
}

function privacyHr(): LegalDoc {
  const o = operator();
  return {
    title: "Pravila privatnosti",
    updated: "Posljednje ažuriranje: 1. studenoga 2026.",
    intro:
      "Astrabela je katalog kozmetičkih salona, brijačnica i restorana u Europi s online rezervacijom i ocjenama klijenata za svakog stručnjaka. Ova pravila objašnjavaju koje osobne podatke obrađujemo, u koju svrhu i koja su vaša prava prema GDPR-u.",
    sections: [
      { title: "1. Tko smo", body: [`Uslugom astrabela.com upravlja ${who()}. Pitanja o vašim podacima pošaljite na ${o.email}.`] },
      {
        title: "2. Koje podatke obrađujemo",
        body: [
          "Kad rezervirate ili ocjenjujete (klijenti):",
          [
            "ime, e-pošta i broj mobitela upisani pri rezervaciji te vaša poruka salonu;",
            "sama rezervacija: salon, stručnjak, usluga, datum, vrijeme i status;",
            "vaša ocjena: zvjezdice, tekst i ime koje želite prikazati;",
            "ako izradite račun klijenta: ime i e-pošta te lozinka pohranjena samo u šifriranom obliku (hash) ili, pri prijavi putem Googlea, identifikator vašeg Google računa (vašu Google lozinku nikada ne vidimo).",
          ],
          "Kad salon ili restoran koristi Astrabelu (tvrtke):",
          [
            "ime i e-pošta vlasnika računa te lozinka (pohranjena samo šifrirano);",
            "podaci o tvrtki: naziv, adresa, telefon, e-pošta, porezni broj, tim, usluge, cijene, radno vrijeme, jelovnik i poveznice na društvene mreže.",
          ],
          "Tehnički podaci: kolačići za prijavu, kolačić za jezik i zapisi poslužitelja (npr. IP adresa i vrijeme zahtjeva), koje čuvamo iz sigurnosnih razloga.",
        ],
      },
      {
        title: "3. Svrhe i pravne osnove",
        body: [
          [
            "izvršenje i upravljanje rezervacijama: izvršenje ugovora (čl. 6. st. 1. t. (b) GDPR-a);",
            "upravljanje računima i pretplatama tvrtki: izvršenje ugovora;",
            "objava ocjena i sprječavanje lažnih ocjena: legitimni interes za pouzdan katalog (čl. 6. st. 1. t. (f));",
            "sigurno funkcioniranje usluge: legitimni interes;",
            "porezne i računovodstvene obveze: pravna obveza (čl. 6. st. 1. t. (c)).",
          ],
          "Osobne podatke ne prodajemo i ne koristimo ih za oglašavanje.",
        ],
      },
      {
        title: "4. Uloga salona i naša uloga",
        body: [
          "Kod rezervacija o korištenju podataka svojih klijenata odlučuje salon koji odaberete i on je njihov voditelj obrade. Astrabela te podatke obrađuje u ime salona kao izvršitelj obrade (čl. 28. GDPR-a) i samo radi pružanja usluge. Za ocjene, javni katalog i sigurnost usluge voditelj obrade je Astrabela.",
        ],
      },
      {
        title: "5. Primatelji podataka",
        body: [
          "Salon ili restoran u kojem rezervirate. Koristimo i sljedeće pružatelje usluga, vezane ugovorima o obradi podataka:",
          [
            "Vercel Inc. – hosting; usluga radi u Frankfurtu (EU). Vercel je američka tvrtka; prijenos podataka izvan EU-a osiguravaju standardne ugovorne klauzule EU-a i okvir EU-US Data Privacy Framework;",
            "Neon – baza podataka u Frankfurtu (EU);",
            "Cloudflare – usluga naziva domena (DNS);",
            "Google – samo ako se prijavljujete putem Googlea.",
          ],
        ],
      },
      {
        title: "6. Razdoblje čuvanja",
        body: [
          [
            "podaci klijenata i rezervacija: dok je račun salona aktivan, najdulje 2 godine od vašeg posljednjeg posjeta;",
            "ocjene: dok je salon na Astrabeli;",
            "računi klijenata: do brisanja (gumb na stranici računa);",
            "računi tvrtki: do zatvaranja računa;",
            "računi i podaci o naplati: 10 godina prema portugalskom poreznom pravu;",
            "prijave tvrtki: 30 dana.",
          ],
        ],
      },
      {
        title: "7. Kolačići",
        body: [
          "Koristimo samo kolačiće nužne za rad usluge: za održavanje prijave (i prikaz vašeg imena u izborniku), kratkotrajne pri prijavi putem Googlea, jedan za jezik i jedan koji pamti jela koja vam se sviđaju u jelovniku restorana (nastaje tek kad dodirnete ♥ i sadrži nasumični kod, a ne vaše ime). Ne koristimo analitičke ni oglasne kolačiće, pa ne tražimo privolu za kolačiće.",
        ],
      },
      {
        title: "8. Vaša prava",
        body: [
          `Možete zatražiti pristup svojim podacima, njihov ispravak ili brisanje, ograničenje obrade, uložiti prigovor i dobiti podatke u prenosivom obliku. Pišite na ${o.email}; odgovaramo u roku od mjesec dana. Ako su podaci proslijeđeni salonu, proslijedit ćemo mu i vaš zahtjev. Pritužbu možete podnijeti i Agenciji za zaštitu osobnih podataka (azop.hr) ili portugalskom tijelu CNPD (www.cnpd.pt).`,
        ],
      },
      {
        title: "9. Sigurnost",
        body: [
          "Usluga radi samo putem HTTPS-a, lozinke su pohranjene šifrirano, a poveznice za rezervacije i ocjene su osobne i teško ih je pogoditi. Ne dijelite svoju osobnu poveznicu s drugima.",
        ],
      },
      {
        title: "10. Izmjene",
        body: ["Ako izmijenimo ova pravila, ovdje ćemo objaviti novu verziju s datumom. O važnim izmjenama obavijestit ćemo vas u usluzi."],
      },
    ],
  };
}

function termsHr(): LegalDoc {
  const o = operator();
  return {
    title: "Uvjeti korištenja",
    updated: "Posljednje ažuriranje: 1. studenoga 2026.",
    intro: `Ovi uvjeti uređuju korištenje usluge astrabela.com, kojom upravlja ${who()}. Korištenjem usluge ili izradom poslovnog računa prihvaćate ih.`,
    sections: [
      {
        title: "1. Usluga",
        body: [
          "Astrabela klijentima omogućuje pronalaženje kozmetičkih salona, brijačnica i restorana, online rezervaciju usluga, ocjenjivanje stručnjaka i pregled jelovnika restorana. Saloni i restorani u svom poslovnom računu upravljaju profilom, timom, uslugama, kalendarom i jelovnikom.",
        ],
      },
      {
        title: "2. Za klijente",
        body: [
          [
            "Korištenje Astrabele je besplatno i ne zahtijeva račun.",
            "Rezervacija je ugovor između vas i salona. Usluge, cijene i trajanje određuje salon, a uslugu pruža salon, ne Astrabela.",
            "Astrabela ne prima plaćanja: plaćate izravno u salonu.",
            "Posjet možete otkazati putem osobne poveznice koju dobijete. Otkažite ga ako ne možete doći.",
          ],
        ],
      },
      {
        title: "3. Ocjene",
        body: [
          "Svaki klijent prijavljen na Astrabelu može ocijeniti stručnjaka salona, jednom u 30 dana za istog stručnjaka. Klijenti s posjetom rezerviranim putem Astrabele ili potvrđenim od salona mogu ocjenjivati i putem osobne poveznice; te ocjene imaju oznaku potvrđenog posjeta. Ocjena mora:",
          [
            "opisivati vaše vlastito, stvarno iskustvo;",
            "biti bez uvreda, prijetnji i diskriminacije;",
            "ne sadržavati osobne podatke drugih, oglase ni poveznice.",
          ],
          "Ocjene koje krše ova pravila možemo sakriti. Salon ne može brisati ni mijenjati ocjene; može javno odgovoriti ili prijaviti ocjenu na moderiranje.",
        ],
      },
      {
        title: "4. Za salone i restorane",
        body: [
          [
            "Podaci u profilu, cijene i jelovnik moraju biti istiniti i ažurni. Za njih i za svoje usluge odgovarate vi.",
            "Čuvajte svoju lozinku; odgovarate za aktivnosti na svom računu.",
            "Ne izrađujte lažne rezervacije, ocjene ni zahtjeve za ocjenu i ne tražite ocjene u zamjenu za nagradu.",
            "U pretraživanju se prikazuju samo profili s aktivnom pretplatom ili u probnom razdoblju.",
          ],
        ],
      },
      {
        title: "5. Cijene",
        body: [
          "Za salone, brijačnice i restorane prva 3 mjeseca su besplatna, bez kartice za početak. Nakon toga za prikazivanje je potrebna pretplata:",
          PRICES.hr,
          "Uvjeti plaćanja prikazuju se prije svake naplate. Cijene možemo promijeniti uz najavu od najmanje 30 dana; promjena vrijedi od sljedećeg obračunskog razdoblja.",
        ],
      },
      {
        title: "6. Ugovor o obradi osobnih podataka (tvrtke)",
        body: [
          "Za podatke klijenata u rezervacijama tvrtka je voditelj obrade, a Astrabela izvršitelj obrade (čl. 28. GDPR-a). Astrabela:",
          [
            "obrađuje te podatke samo radi pružanja usluge i prema uputama koje tvrtka daje putem usluge;",
            "čuva njihovu povjerljivost i štiti ih odgovarajućim sigurnosnim mjerama;",
            "koristi samo podizvršitelje navedene u pravilima privatnosti i o novima unaprijed obavještava tvrtke;",
            "pomaže tvrtki kod zahtjeva klijenata i prijave povreda osobnih podataka;",
            "nakon zatvaranja računa briše ili predaje podatke, osim ako zakon zahtijeva njihovo čuvanje.",
          ],
        ],
      },
      {
        title: "7. Obustava i zatvaranje računa",
        body: [
          "Poslovni račun možete zatvoriti u bilo kojem trenutku tako da nam pišete. Profil koji krši ove uvjete, zakon ili prava drugih možemo obustaviti ili ukloniti, uz navođenje razloga.",
        ],
      },
      {
        title: "8. Odgovornost",
        body: [
          "Trudimo se da usluga bude dostupna i točna, ali ne možemo jamčiti da će uvijek raditi bez prekida i pogrešaka. Astrabela nije strana ugovora između klijenta i salona i ne odgovara za usluge salona. Ništa u ovim uvjetima ne ograničava zakonska prava potrošača.",
        ],
      },
      {
        title: "9. Mjerodavno pravo i pritužbe",
        body: [
          `Na uvjete se primjenjuje portugalsko pravo, ne dirajući u zaštitu koju vam kao potrošaču pruža pravo države vašeg prebivališta. Pritužbe pošaljite na ${o.email}.`,
        ],
      },
      {
        title: "10. Izmjene",
        body: ["Ove uvjete možemo ažurirati. Nova verzija bit će objavljena ovdje s datumom; o važnim izmjenama tvrtke obavještavamo unaprijed."],
      },
    ],
  };
}

function privacyRo(): LegalDoc {
  const o = operator();
  return {
    title: "Politica de confidențialitate",
    updated: "Ultima actualizare: 1 noiembrie 2026",
    intro:
      "Astrabela este un catalog de saloane de înfrumusețare, frizerii și restaurante din Europa, cu programare online și recenzii ale clienților pentru fiecare specialist. Această politică explică ce date personale prelucrăm, în ce scop și ce drepturi aveți conform GDPR.",
    sections: [
      { title: "1. Cine suntem", body: [`Serviciul astrabela.com este operat de ${who()}. Întrebările despre datele dvs. le puteți trimite la ${o.email}.`] },
      {
        title: "2. Ce date prelucrăm",
        body: [
          "Când faceți o programare sau lăsați o recenzie (clienți):",
          [
            "numele, e-mailul și numărul de telefon mobil introduse la programare, precum și mesajul dvs. către salon;",
            "programarea propriu-zisă: salonul, specialistul, serviciul, data, ora și starea;",
            "recenzia dvs.: stelele, textul și numele pe care doriți să-l afișați;",
            "dacă vă creați un cont de client: numele și e-mailul, iar parola stocată doar în formă criptată (hash) sau, la autentificarea cu Google, identificatorul contului dvs. Google (nu vedem niciodată parola dvs. Google).",
          ],
          "Când un salon sau un restaurant folosește Astrabela (afaceri):",
          [
            "numele și e-mailul titularului contului și parola (stocată doar criptat);",
            "datele afacerii: denumirea, adresa, telefonul, e-mailul, codul fiscal, echipa, serviciile, prețurile, programul, meniul și linkurile către rețelele sociale.",
          ],
          "Date tehnice: cookie-uri de autentificare, un cookie pentru limbă și jurnale ale serverului (de exemplu adresa IP și ora cererii), păstrate din motive de securitate.",
        ],
      },
      {
        title: "3. Scopuri și temeiuri juridice",
        body: [
          [
            "efectuarea și gestionarea programărilor: executarea unui contract (art. 6 alin. (1) lit. (b) GDPR);",
            "gestionarea conturilor și abonamentelor afacerilor: executarea unui contract;",
            "publicarea recenziilor și prevenirea recenziilor false: interesul legitim pentru un catalog de încredere (art. 6 alin. (1) lit. (f));",
            "funcționarea în siguranță a serviciului: interes legitim;",
            "obligații fiscale și contabile: obligație legală (art. 6 alin. (1) lit. (c)).",
          ],
          "Nu vindem datele personale și nu le folosim în scopuri publicitare.",
        ],
      },
      {
        title: "4. Rolul salonului și rolul nostru",
        body: [
          "Pentru programări, salonul pe care îl alegeți decide cum sunt folosite datele clienților săi și este operatorul acestora. Astrabela prelucrează aceste date în numele salonului, ca persoană împuternicită (art. 28 GDPR), doar pentru a furniza serviciul. Pentru recenzii, catalogul public și securitatea serviciului, operatorul este Astrabela.",
        ],
      },
      {
        title: "5. Destinatarii datelor",
        body: [
          "Salonul sau restaurantul la care faceți programarea. Folosim și următorii furnizori, legați prin contracte de prelucrare a datelor:",
          [
            "Vercel Inc. – găzduire; serviciul rulează în Frankfurt (UE). Vercel este o companie americană; transferul în afara UE este acoperit de clauzele contractuale standard ale UE și de cadrul EU-US Data Privacy Framework;",
            "Neon – baza de date din Frankfurt (UE);",
            "Cloudflare – serviciul de nume de domeniu (DNS);",
            "Google – doar dacă vă autentificați cu Google.",
          ],
        ],
      },
      {
        title: "6. Perioada de păstrare",
        body: [
          [
            "datele clienților și ale programărilor: cât timp contul salonului este activ, cel mult 2 ani de la ultima dvs. vizită;",
            "recenziile: cât timp salonul este pe Astrabela;",
            "conturile clienților: până la ștergere (butonul de pe pagina contului);",
            "conturile afacerilor: până la închiderea contului;",
            "facturile și datele de plată: 10 ani, conform legislației fiscale portugheze;",
            "cererile de înregistrare ale afacerilor: 30 de zile.",
          ],
        ],
      },
      {
        title: "7. Cookie-uri",
        body: [
          "Folosim doar cookie-uri necesare funcționării serviciului: pentru a vă menține autentificat (și a afișa numele dvs. în meniu), unele de scurtă durată la autentificarea cu Google, unul pentru limbă și unul care reține preparatele care vă plac din meniul unui restaurant (apare doar când atingeți ♥ și conține un cod aleatoriu, nu numele dvs.). Nu folosim cookie-uri de analiză sau de publicitate, așa că nu vă cerem consimțământul pentru cookie-uri.",
        ],
      },
      {
        title: "8. Drepturile dvs.",
        body: [
          `Puteți solicita accesul la datele dvs., rectificarea sau ștergerea lor, restricționarea prelucrării, vă puteți opune prelucrării și puteți primi datele într-un format portabil. Scrieți-ne la ${o.email}; răspundem în termen de o lună. Dacă datele au fost transmise unui salon, îi vom transmite și cererea dvs. Puteți depune și o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (www.dataprotection.ro) sau la autoritatea portugheză CNPD (www.cnpd.pt).`,
        ],
      },
      {
        title: "9. Securitate",
        body: [
          "Serviciul funcționează doar prin HTTPS, parolele sunt stocate criptat, iar linkurile pentru programări și recenzii sunt personale și greu de ghicit. Nu vă partajați linkul personal cu alte persoane.",
        ],
      },
      {
        title: "10. Modificări",
        body: ["Dacă modificăm această politică, vom publica aici noua versiune cu data. Despre modificările importante vă vom informa în cadrul serviciului."],
      },
    ],
  };
}

function termsRo(): LegalDoc {
  const o = operator();
  return {
    title: "Termeni și condiții",
    updated: "Ultima actualizare: 1 noiembrie 2026",
    intro: `Acești termeni reglementează utilizarea serviciului astrabela.com, operat de ${who()}. Prin utilizarea serviciului sau crearea unui cont de afacere îi acceptați.`,
    sections: [
      {
        title: "1. Serviciul",
        body: [
          "Astrabela permite clienților să găsească saloane de înfrumusețare, frizerii și restaurante, să programeze servicii online, să evalueze specialiștii și să consulte meniurile restaurantelor. Saloanele și restaurantele își gestionează în contul de afacere profilul, echipa, serviciile, calendarul și meniul.",
        ],
      },
      {
        title: "2. Pentru clienți",
        body: [
          [
            "Folosirea Astrabela este gratuită și nu necesită cont.",
            "Programarea este un contract între dvs. și salon. Serviciile, prețurile și durata sunt stabilite de salon, iar serviciul este prestat de salon, nu de Astrabela.",
            "Astrabela nu primește plăți: plătiți direct la salon.",
            "Puteți anula vizita prin linkul personal pe care îl primiți. Vă rugăm să o anulați dacă nu puteți veni.",
          ],
        ],
      },
      {
        title: "3. Recenzii",
        body: [
          "Orice client autentificat pe Astrabela poate evalua un specialist al salonului, o dată la 30 de zile pentru același specialist. Clienții cu o vizită programată prin Astrabela sau confirmată de salon pot lăsa recenzii și printr-un link personal; aceste recenzii poartă eticheta de vizită confirmată. O recenzie trebuie:",
          [
            "să descrie propria dvs. experiență reală;",
            "să nu conțină insulte, amenințări sau discriminare;",
            "să nu conțină date personale ale altor persoane, reclame sau linkuri.",
          ],
          "Putem ascunde recenziile care încalcă aceste reguli. Salonul nu poate șterge sau modifica recenziile; poate răspunde public sau poate semnala o recenzie pentru moderare.",
        ],
      },
      {
        title: "4. Pentru saloane și restaurante",
        body: [
          [
            "Datele din profil, prețurile și meniul trebuie să fie corecte și actualizate. Dvs. răspundeți pentru ele și pentru serviciile dvs.",
            "Păstrați-vă parola în siguranță; răspundeți pentru activitatea din contul dvs.",
            "Nu creați programări, recenzii sau cereri de recenzie false și nu cereți recenzii în schimbul unei recompense.",
            "În căutare apar doar profilurile cu abonament activ sau aflate în perioada de probă.",
          ],
        ],
      },
      {
        title: "5. Prețuri",
        body: [
          "Pentru saloane, frizerii și restaurante primele 3 luni sunt gratuite, fără card la început. După aceea, pentru a fi afișat este necesar un abonament:",
          PRICES.ro,
          "Condițiile de plată sunt afișate înainte de fiecare debitare. Putem modifica prețurile cu un preaviz de cel puțin 30 de zile; modificarea se aplică de la următoarea perioadă de facturare.",
        ],
      },
      {
        title: "6. Acord de prelucrare a datelor (afaceri)",
        body: [
          "Pentru datele clienților din programări, afacerea este operator, iar Astrabela este persoană împuternicită (art. 28 GDPR). Astrabela:",
          [
            "prelucrează aceste date doar pentru a furniza serviciul și conform instrucțiunilor pe care afacerea le dă prin intermediul serviciului;",
            "le păstrează confidențialitatea și le protejează prin măsuri de securitate adecvate;",
            "folosește doar subîmputerniciții enumerați în politica de confidențialitate și informează în prealabil afacerile despre cei noi;",
            "ajută afacerea în privința cererilor clienților și a notificării încălcărilor securității datelor;",
            "după închiderea contului șterge sau predă datele, cu excepția cazului în care legea impune păstrarea lor.",
          ],
        ],
      },
      {
        title: "7. Suspendarea și închiderea contului",
        body: [
          "Puteți închide contul de afacere oricând, scriindu-ne. Putem suspenda sau elimina un profil care încalcă acești termeni, legea sau drepturile altora, indicând motivul.",
        ],
      },
      {
        title: "8. Răspundere",
        body: [
          "Ne străduim ca serviciul să fie disponibil și corect, dar nu putem garanta că va funcționa mereu fără întreruperi sau erori. Astrabela nu este parte la contractul dintre client și salon și nu răspunde pentru serviciile salonului. Nimic din acești termeni nu limitează drepturile legale ale consumatorilor.",
        ],
      },
      {
        title: "9. Legea aplicabilă și reclamații",
        body: [
          `Acestor termeni li se aplică legea portugheză, fără a aduce atingere protecției pe care v-o oferă, în calitate de consumator, legea țării dvs. de reședință. Reclamațiile le puteți trimite la ${o.email}.`,
        ],
      },
      {
        title: "10. Modificări",
        body: ["Putem actualiza acești termeni. Noua versiune va fi publicată aici cu data; despre modificările importante informăm afacerile în prealabil."],
      },
    ],
  };
}

function privacyBg(): LegalDoc {
  const o = operator();
  return {
    title: "Политика за поверителност",
    updated: "Последна актуализация: 1 ноември 2026 г.",
    intro:
      "Astrabela е каталог на салони за красота, бръснарници и ресторанти в Европа с онлайн записване и отзиви на клиенти за всеки специалист. Тази политика обяснява какви лични данни обработваме, за какво и какви са Вашите права съгласно GDPR.",
    sections: [
      { title: "1. Кои сме ние", body: [`Услугата astrabela.com се управлява от ${who()}. Въпроси относно Вашите данни можете да изпращате на ${o.email}.`] },
      {
        title: "2. Какви данни обработваме",
        body: [
          "Когато се записвате или пишете отзив (клиенти):",
          [
            "име, имейл и мобилен телефон, въведени при записването, както и Вашето съобщение до салона;",
            "самото записване: салон, специалист, услуга, дата, час и статус;",
            "Вашият отзив: звезди, текст и името, което искате да се показва;",
            "ако създадете клиентски профил: име и имейл, а паролата се съхранява само в криптиран вид (hash) или, при вход с Google, идентификаторът на Вашия Google акаунт (никога не виждаме паролата Ви за Google).",
          ],
          "Когато салон или ресторант използва Astrabela (бизнеси):",
          [
            "име и имейл на титуляря на профила и парола (съхранявана само криптирано);",
            "данни за бизнеса: наименование, адрес, телефон, имейл, данъчен номер, екип, услуги, цени, работно време, меню и връзки към социални мрежи.",
          ],
          "Технически данни: бисквитки за вход, бисквитка за езика и сървърни журнали (например IP адрес и час на заявката), които пазим от съображения за сигурност.",
        ],
      },
      {
        title: "3. Цели и правни основания",
        body: [
          [
            "извършване и управление на записванията: изпълнение на договор (чл. 6, пар. 1, буква „б“ от GDPR);",
            "управление на профилите и абонаментите на бизнесите: изпълнение на договор;",
            "публикуване на отзиви и предотвратяване на фалшиви отзиви: легитимен интерес от надежден каталог (чл. 6, пар. 1, буква „е“);",
            "сигурна работа на услугата: легитимен интерес;",
            "данъчни и счетоводни задължения: законово задължение (чл. 6, пар. 1, буква „в“).",
          ],
          "Не продаваме лични данни и не ги използваме за реклама.",
        ],
      },
      {
        title: "4. Ролята на салона и нашата роля",
        body: [
          "При записванията салонът, който изберете, решава как се използват данните на неговите клиенти и е техен администратор. Astrabela обработва тези данни от името на салона като обработващ лични данни (чл. 28 от GDPR) и само за предоставяне на услугата. За отзивите, публичния каталог и сигурността на услугата администратор е Astrabela.",
        ],
      },
      {
        title: "5. Получатели на данните",
        body: [
          "Салонът или ресторантът, в който се записвате. Използваме и следните доставчици, обвързани с договори за обработване на данни:",
          [
            "Vercel Inc. – хостинг; услугата работи във Франкфурт (ЕС). Vercel е американска компания; предаването на данни извън ЕС е обезпечено със стандартните договорни клаузи на ЕС и рамката EU-US Data Privacy Framework;",
            "Neon – база данни във Франкфурт (ЕС);",
            "Cloudflare – услуга за имена на домейни (DNS);",
            "Google – само ако влизате с Google.",
          ],
        ],
      },
      {
        title: "6. Срок на съхранение",
        body: [
          [
            "данни на клиенти и записвания: докато профилът на салона е активен, най-много 2 години след последното Ви посещение;",
            "отзиви: докато салонът е в Astrabela;",
            "клиентски профили: до изтриването им (бутон на страницата на профила);",
            "профили на бизнеси: до закриването на профила;",
            "фактури и данни за плащания: 10 години съгласно португалското данъчно право;",
            "заявки за регистрация на бизнеси: 30 дни.",
          ],
        ],
      },
      {
        title: "7. Бисквитки",
        body: [
          "Използваме само бисквитки, необходими за работата на услугата: за поддържане на входа (и показване на името Ви в менюто), краткотрайни при вход с Google, една за езика и една, която запомня ястията, които харесвате в менюто на ресторант (създава се едва когато докоснете ♥ и съдържа случаен код, а не Вашето име). Не използваме аналитични или рекламни бисквитки, затова не искаме съгласие за бисквитки.",
        ],
      },
      {
        title: "8. Вашите права",
        body: [
          `Можете да поискате достъп до данните си, тяхното коригиране или изтриване, ограничаване на обработването, да възразите и да получите данните си в преносим формат. Пишете ни на ${o.email}; отговаряме в срок от един месец. Ако данните са предадени на салон, ще му препратим и Вашето искане. Можете да подадете жалба и до Комисията за защита на личните данни (www.cpdp.bg) или до португалския орган CNPD (www.cnpd.pt).`,
        ],
      },
      {
        title: "9. Сигурност",
        body: [
          "Услугата работи само през HTTPS, паролите се съхраняват криптирано, а връзките за записвания и отзиви са лични и трудни за отгатване. Не споделяйте личната си връзка с други хора.",
        ],
      },
      {
        title: "10. Промени",
        body: ["Ако променим тази политика, ще публикуваме тук новата версия с дата. За важни промени ще Ви уведомим в услугата."],
      },
    ],
  };
}

function termsBg(): LegalDoc {
  const o = operator();
  return {
    title: "Общи условия",
    updated: "Последна актуализация: 1 ноември 2026 г.",
    intro: `Тези условия уреждат използването на услугата astrabela.com, управлявана от ${who()}. С използването на услугата или създаването на бизнес профил Вие ги приемате.`,
    sections: [
      {
        title: "1. Услугата",
        body: [
          "Astrabela позволява на клиентите да намират салони за красота, бръснарници и ресторанти, да се записват онлайн, да оценяват специалисти и да разглеждат менютата на ресторанти. Салоните и ресторантите управляват в бизнес профила си своя профил, екип, услуги, календар и меню.",
        ],
      },
      {
        title: "2. За клиенти",
        body: [
          [
            "Използването на Astrabela е безплатно и не изисква профил.",
            "Записването е договор между Вас и салона. Услугите, цените и продължителността се определят от салона, а услугата се предоставя от салона, не от Astrabela.",
            "Astrabela не приема плащания: плащате директно в салона.",
            "Можете да откажете посещението чрез личната връзка, която получавате. Моля, откажете го, ако не можете да дойдете.",
          ],
        ],
      },
      {
        title: "3. Отзиви",
        body: [
          "Всеки клиент, влязъл в Astrabela, може да оцени специалист на салона веднъж на 30 дни за един и същ специалист. Клиенти с посещение, записано чрез Astrabela или потвърдено от салона, могат да пишат отзиви и чрез лична връзка; тези отзиви носят етикет за потвърдено посещение. Отзивът трябва:",
          [
            "да описва Вашия собствен, реален опит;",
            "да не съдържа обиди, заплахи или дискриминация;",
            "да не съдържа лични данни на други хора, реклами или връзки.",
          ],
          "Можем да скрием отзиви, които нарушават тези правила. Салонът не може да изтрива или променя отзиви; може да отговори публично или да подаде сигнал за модерация.",
        ],
      },
      {
        title: "4. За салони и ресторанти",
        body: [
          [
            "Данните в профила, цените и менюто трябва да са верни и актуални. Вие отговаряте за тях и за своите услуги.",
            "Пазете паролата си; отговаряте за действията в своя профил.",
            "Не създавайте фалшиви записвания, отзиви или покани за отзив и не искайте отзиви срещу награда.",
            "В търсенето се показват само профили с активен абонамент или в пробен период.",
          ],
        ],
      },
      {
        title: "5. Цени",
        body: [
          "За салони, бръснарници и ресторанти първите 3 месеца са безплатни, без карта за начало. След това за показване е необходим абонамент:",
          PRICES.bg,
          "Условията за плащане се показват преди всяко таксуване. Можем да променим цените с предизвестие от поне 30 дни; промяната важи от следващия период на фактуриране.",
        ],
      },
      {
        title: "6. Споразумение за обработване на данни (бизнеси)",
        body: [
          "За данните на клиентите в записванията бизнесът е администратор, а Astrabela – обработващ лични данни (чл. 28 от GDPR). Astrabela:",
          [
            "обработва тези данни само за предоставяне на услугата и според указанията, които бизнесът дава чрез услугата;",
            "пази тяхната поверителност и ги защитава с подходящи мерки за сигурност;",
            "използва само подобработващите, посочени в политиката за поверителност, и уведомява предварително бизнесите за нови;",
            "помага на бизнеса при искания на клиенти и при уведомяване за нарушения на сигурността на данните;",
            "след закриване на профила изтрива или предава данните, освен ако законът изисква тяхното съхранение.",
          ],
        ],
      },
      {
        title: "7. Спиране и закриване на профил",
        body: [
          "Можете да закриете бизнес профила си по всяко време, като ни пишете. Можем да спрем или премахнем профил, който нарушава тези условия, закона или правата на други лица, като посочим причината.",
        ],
      },
      {
        title: "8. Отговорност",
        body: [
          "Стремим се услугата да е достъпна и точна, но не можем да гарантираме, че винаги ще работи без прекъсвания и грешки. Astrabela не е страна по договора между клиента и салона и не отговаря за услугите на салона. Нищо в тези условия не ограничава законовите права на потребителите.",
        ],
      },
      {
        title: "9. Приложимо право и жалби",
        body: [
          `За тези условия се прилага португалското право, без да се засяга защитата, която Ви дава като потребител правото на държавата, в която живеете. Жалби изпращайте на ${o.email}.`,
        ],
      },
      {
        title: "10. Промени",
        body: ["Можем да актуализираме тези условия. Новата версия ще бъде публикувана тук с дата; за важни промени уведомяваме бизнесите предварително."],
      },
    ],
  };
}

function privacyDa(): LegalDoc {
  const o = operator();
  return {
    title: "Privatlivspolitik",
    updated: "Senest opdateret: 1. november 2026",
    intro:
      "Astrabela er et katalog over skønhedssaloner, barbershops og restauranter i Europa med onlinebooking og kundeanmeldelser af hver behandler. Denne politik forklarer, hvilke personoplysninger vi behandler, hvorfor, og hvilke rettigheder du har efter GDPR.",
    sections: [
      { title: "1. Hvem vi er", body: [`Tjenesten astrabela.com drives af ${who()}. Spørgsmål om dine oplysninger kan sendes til ${o.email}.`] },
      {
        title: "2. Hvilke oplysninger vi behandler",
        body: [
          "Når du booker eller skriver en anmeldelse (kunder):",
          [
            "navn, e-mail og mobilnummer, som du angiver ved booking, samt din besked til salonen;",
            "selve bookingen: salon, behandler, behandling, dato, tidspunkt og status;",
            "din anmeldelse: stjerner, tekst og det navn, du vil vise;",
            "hvis du opretter en kundekonto: navn og e-mail samt en adgangskode, der kun gemmes krypteret (hash), eller ved login med Google id'et for din Google-konto (vi ser aldrig din Google-adgangskode).",
          ],
          "Når en salon eller restaurant bruger Astrabela (virksomheder):",
          [
            "kontoindehaverens navn og e-mail samt adgangskode (kun gemt krypteret);",
            "virksomhedens oplysninger: navn, adresse, telefon, e-mail, CVR-nummer, team, behandlinger, priser, åbningstider, menu og links til sociale medier.",
          ],
          "Tekniske oplysninger: cookies til login, en cookie til sprog og serverlogs (f.eks. IP-adresse og tidspunkt for forespørgslen), som vi gemmer af sikkerhedshensyn.",
        ],
      },
      {
        title: "3. Formål og retsgrundlag",
        body: [
          [
            "gennemførelse og administration af bookinger: opfyldelse af en kontrakt (art. 6, stk. 1, litra b, i GDPR);",
            "administration af virksomhedernes konti og abonnementer: opfyldelse af en kontrakt;",
            "offentliggørelse af anmeldelser og forebyggelse af falske anmeldelser: legitim interesse i et pålideligt katalog (art. 6, stk. 1, litra f);",
            "sikker drift af tjenesten: legitim interesse;",
            "skatte- og regnskabsforpligtelser: retlig forpligtelse (art. 6, stk. 1, litra c).",
          ],
          "Vi sælger ikke personoplysninger og bruger dem ikke til reklame.",
        ],
      },
      {
        title: "4. Salonens rolle og vores rolle",
        body: [
          "Ved bookinger er det den salon, du vælger, der bestemmer, hvordan dens kunders oplysninger bruges, og den er dataansvarlig for dem. Astrabela behandler disse oplysninger på salonens vegne som databehandler (art. 28 i GDPR) og kun for at levere tjenesten. For anmeldelser, det offentlige katalog og tjenestens sikkerhed er Astrabela dataansvarlig.",
        ],
      },
      {
        title: "5. Modtagere af oplysningerne",
        body: [
          "Den salon eller restaurant, du booker hos. Vi bruger også følgende leverandører, som er bundet af databehandleraftaler:",
          [
            "Vercel Inc. – hosting; tjenesten kører i Frankfurt (EU). Vercel er en amerikansk virksomhed; overførsel uden for EU er dækket af EU's standardkontraktbestemmelser og EU-US Data Privacy Framework;",
            "Neon – database i Frankfurt (EU);",
            "Cloudflare – domænenavnetjeneste (DNS);",
            "Google – kun hvis du logger ind med Google.",
          ],
        ],
      },
      {
        title: "6. Opbevaringsperiode",
        body: [
          [
            "kunde- og bookingoplysninger: så længe salonens konto er aktiv, højst 2 år efter dit seneste besøg;",
            "anmeldelser: så længe salonen er på Astrabela;",
            "kundekonti: indtil de slettes (knap på kontosiden);",
            "virksomhedskonti: indtil kontoen lukkes;",
            "fakturaer og betalingsoplysninger: 10 år efter portugisisk skatteret;",
            "virksomheders tilmeldingsanmodninger: 30 dage.",
          ],
        ],
      },
      {
        title: "7. Cookies",
        body: [
          "Vi bruger kun cookies, der er nødvendige for tjenesten: til at holde dig logget ind (og vise dit navn i menuen), kortvarige ved login med Google, én til sproget og én, der husker de retter, du synes om i en restaurants menu (den oprettes først, når du trykker på ♥, og indeholder en tilfældig kode, ikke dit navn). Vi bruger ikke analyse- eller reklamecookies og beder derfor ikke om samtykke til cookies.",
        ],
      },
      {
        title: "8. Dine rettigheder",
        body: [
          `Du kan anmode om indsigt i dine oplysninger, berigtigelse eller sletning af dem, begrænsning af behandlingen, gøre indsigelse og få dine oplysninger i et overførbart format. Skriv til ${o.email}; vi svarer inden for en måned. Hvis oplysningerne er videregivet til en salon, sender vi også din anmodning videre til den. Du kan også klage til Datatilsynet (www.datatilsynet.dk) eller til den portugisiske myndighed CNPD (www.cnpd.pt).`,
        ],
      },
      {
        title: "9. Sikkerhed",
        body: [
          "Tjenesten kører kun over HTTPS, adgangskoder gemmes krypteret, og links til bookinger og anmeldelser er personlige og svære at gætte. Del ikke dit personlige link med andre.",
        ],
      },
      {
        title: "10. Ændringer",
        body: ["Hvis vi ændrer denne politik, offentliggør vi den nye version her med dato. Om væsentlige ændringer giver vi besked i tjenesten."],
      },
    ],
  };
}

function termsDa(): LegalDoc {
  const o = operator();
  return {
    title: "Vilkår for brug",
    updated: "Senest opdateret: 1. november 2026",
    intro: `Disse vilkår gælder for brugen af tjenesten astrabela.com, som drives af ${who()}. Ved at bruge tjenesten eller oprette en virksomhedskonto accepterer du dem.`,
    sections: [
      {
        title: "1. Tjenesten",
        body: [
          "Astrabela giver kunder mulighed for at finde skønhedssaloner, barbershops og restauranter, booke behandlinger online, bedømme behandlere og se restauranters menuer. Saloner og restauranter administrerer deres profil, team, behandlinger, kalender og menu i virksomhedskontoen.",
        ],
      },
      {
        title: "2. For kunder",
        body: [
          [
            "Det er gratis at bruge Astrabela, og det kræver ingen konto.",
            "En booking er en aftale mellem dig og salonen. Behandlinger, priser og varighed fastsættes af salonen, og behandlingen udføres af salonen, ikke af Astrabela.",
            "Astrabela modtager ingen betalinger: du betaler direkte i salonen.",
            "Du kan aflyse dit besøg via det personlige link, du får. Aflys venligst, hvis du ikke kan komme.",
          ],
        ],
      },
      {
        title: "3. Anmeldelser",
        body: [
          "Alle kunder, der er logget ind på Astrabela, kan bedømme en behandler i en salon, én gang hver 30. dag for den samme behandler. Kunder med et besøg booket via Astrabela eller bekræftet af salonen kan også anmelde via et personligt link; disse anmeldelser er mærket som bekræftet besøg. En anmeldelse skal:",
          [
            "beskrive din egen, reelle oplevelse;",
            "være fri for fornærmelser, trusler og diskrimination;",
            "ikke indeholde andres personoplysninger, reklame eller links.",
          ],
          "Vi kan skjule anmeldelser, der bryder disse regler. Salonen kan ikke slette eller ændre anmeldelser; den kan svare offentligt eller indberette en anmeldelse til moderering.",
        ],
      },
      {
        title: "4. For saloner og restauranter",
        body: [
          [
            "Oplysninger i profilen, priser og menu skal være korrekte og opdaterede. Du er ansvarlig for dem og for dine ydelser.",
            "Pas på din adgangskode; du er ansvarlig for aktiviteten på din konto.",
            "Opret ikke falske bookinger, anmeldelser eller anmodninger om anmeldelser, og bed ikke om anmeldelser mod en belønning.",
            "Kun profiler med aktivt abonnement eller i prøveperioden vises i søgningen.",
          ],
        ],
      },
      {
        title: "5. Priser",
        body: [
          "For saloner, barbershops og restauranter er de første 3 måneder gratis, uden kort for at komme i gang. Derefter kræver det et abonnement at blive vist:",
          PRICES.da,
          "Betalingsbetingelserne vises før hver opkrævning. Vi kan ændre priserne med mindst 30 dages varsel; ændringen gælder fra næste faktureringsperiode.",
        ],
      },
      {
        title: "6. Databehandleraftale (virksomheder)",
        body: [
          "For kundeoplysninger i bookinger er virksomheden dataansvarlig og Astrabela databehandler (art. 28 i GDPR). Astrabela:",
          [
            "behandler kun disse oplysninger for at levere tjenesten og efter de instrukser, virksomheden giver via tjenesten;",
            "holder dem fortrolige og beskytter dem med passende sikkerhedsforanstaltninger;",
            "bruger kun de underdatabehandlere, der er nævnt i privatlivspolitikken, og giver virksomhederne besked på forhånd om nye;",
            "hjælper virksomheden med kunders anmodninger og anmeldelse af brud på persondatasikkerheden;",
            "sletter eller udleverer oplysningerne, når kontoen lukkes, medmindre loven kræver, at de opbevares.",
          ],
        ],
      },
      {
        title: "7. Suspension og lukning af konto",
        body: [
          "Du kan til enhver tid lukke din virksomhedskonto ved at skrive til os. Vi kan suspendere eller fjerne en profil, der bryder disse vilkår, loven eller andres rettigheder, med angivelse af grunden.",
        ],
      },
      {
        title: "8. Ansvar",
        body: [
          "Vi gør vores bedste for, at tjenesten er tilgængelig og korrekt, men kan ikke garantere, at den altid fungerer uden afbrydelser og fejl. Astrabela er ikke part i aftalen mellem kunde og salon og er ikke ansvarlig for salonens ydelser. Intet i disse vilkår begrænser forbrugernes lovbestemte rettigheder.",
        ],
      },
      {
        title: "9. Lovvalg og klager",
        body: [
          `Vilkårene er underlagt portugisisk ret, uden at det berører den beskyttelse, du som forbruger har efter loven i det land, hvor du bor. Klager kan sendes til ${o.email}.`,
        ],
      },
      {
        title: "10. Ændringer",
        body: ["Vi kan opdatere disse vilkår. Den nye version offentliggøres her med dato; om væsentlige ændringer giver vi virksomhederne besked på forhånd."],
      },
    ],
  };
}

function privacySv(): LegalDoc {
  const o = operator();
  return {
    title: "Integritetspolicy",
    updated: "Senast uppdaterad: 1 november 2026",
    intro:
      "Astrabela är en katalog över skönhetssalonger, barberare och restauranger i Europa med onlinebokning och kundomdömen om varje behandlare. Den här policyn förklarar vilka personuppgifter vi behandlar, varför och vilka rättigheter du har enligt GDPR.",
    sections: [
      { title: "1. Vilka vi är", body: [`Tjänsten astrabela.com drivs av ${who()}. Frågor om dina uppgifter kan skickas till ${o.email}.`] },
      {
        title: "2. Vilka uppgifter vi behandlar",
        body: [
          "När du bokar eller skriver ett omdöme (kunder):",
          [
            "namn, e-post och mobilnummer som du anger vid bokningen samt ditt meddelande till salongen;",
            "själva bokningen: salong, behandlare, behandling, datum, tid och status;",
            "ditt omdöme: stjärnor, text och det namn du vill visa;",
            "om du skapar ett kundkonto: namn och e-post samt ett lösenord som bara lagras krypterat (hash) eller, vid inloggning med Google, id:t för ditt Google-konto (vi ser aldrig ditt Google-lösenord).",
          ],
          "När en salong eller restaurang använder Astrabela (företag):",
          [
            "kontoinnehavarens namn och e-post samt lösenord (bara lagrat krypterat);",
            "företagets uppgifter: namn, adress, telefon, e-post, organisationsnummer, team, behandlingar, priser, öppettider, meny och länkar till sociala medier.",
          ],
          "Tekniska uppgifter: cookies för inloggning, en cookie för språk och serverloggar (t.ex. IP-adress och tidpunkt för förfrågan), som vi sparar av säkerhetsskäl.",
        ],
      },
      {
        title: "3. Ändamål och rättslig grund",
        body: [
          [
            "genomförande och hantering av bokningar: fullgörande av avtal (art. 6.1 b i GDPR);",
            "hantering av företagens konton och abonnemang: fullgörande av avtal;",
            "publicering av omdömen och förebyggande av falska omdömen: berättigat intresse av en pålitlig katalog (art. 6.1 f);",
            "säker drift av tjänsten: berättigat intresse;",
            "skatte- och bokföringsskyldigheter: rättslig förpliktelse (art. 6.1 c).",
          ],
          "Vi säljer inte personuppgifter och använder dem inte för reklam.",
        ],
      },
      {
        title: "4. Salongens roll och vår roll",
        body: [
          "Vid bokningar är det salongen du väljer som bestämmer hur dess kunders uppgifter används och som är personuppgiftsansvarig för dem. Astrabela behandlar uppgifterna för salongens räkning som personuppgiftsbiträde (art. 28 i GDPR) och bara för att tillhandahålla tjänsten. För omdömen, den offentliga katalogen och tjänstens säkerhet är Astrabela personuppgiftsansvarig.",
        ],
      },
      {
        title: "5. Mottagare av uppgifterna",
        body: [
          "Den salong eller restaurang där du bokar. Vi använder också följande leverantörer, som är bundna av biträdesavtal:",
          [
            "Vercel Inc. – drift; tjänsten körs i Frankfurt (EU). Vercel är ett amerikanskt företag; överföring utanför EU omfattas av EU:s standardavtalsklausuler och EU-US Data Privacy Framework;",
            "Neon – databas i Frankfurt (EU);",
            "Cloudflare – domännamnstjänst (DNS);",
            "Google – bara om du loggar in med Google.",
          ],
        ],
      },
      {
        title: "6. Lagringstid",
        body: [
          [
            "kund- och bokningsuppgifter: så länge salongens konto är aktivt, högst 2 år efter ditt senaste besök;",
            "omdömen: så länge salongen finns på Astrabela;",
            "kundkonton: tills de raderas (knapp på kontosidan);",
            "företagskonton: tills kontot avslutas;",
            "fakturor och betalningsuppgifter: 10 år enligt portugisisk skattelag;",
            "företags registreringsförfrågningar: 30 dagar.",
          ],
        ],
      },
      {
        title: "7. Cookies",
        body: [
          "Vi använder bara cookies som behövs för att tjänsten ska fungera: för att hålla dig inloggad (och visa ditt namn i menyn), kortlivade vid inloggning med Google, en för språket och en som kommer ihåg vilka rätter du gillar i en restaurangs meny (den skapas först när du trycker på ♥ och innehåller en slumpmässig kod, inte ditt namn). Vi använder inga analys- eller reklamcookies och ber därför inte om samtycke till cookies.",
        ],
      },
      {
        title: "8. Dina rättigheter",
        body: [
          `Du kan begära tillgång till dina uppgifter, rättelse eller radering av dem, begränsning av behandlingen, invända och få dina uppgifter i ett överförbart format. Skriv till ${o.email}; vi svarar inom en månad. Om uppgifterna har lämnats till en salong skickar vi även din begäran vidare dit. Du kan också klaga hos Integritetsskyddsmyndigheten (www.imy.se) eller hos den portugisiska myndigheten CNPD (www.cnpd.pt).`,
        ],
      },
      {
        title: "9. Säkerhet",
        body: [
          "Tjänsten körs bara över HTTPS, lösenord lagras krypterade och länkar till bokningar och omdömen är personliga och svåra att gissa. Dela inte din personliga länk med andra.",
        ],
      },
      {
        title: "10. Ändringar",
        body: ["Om vi ändrar den här policyn publicerar vi den nya versionen här med datum. Om viktiga ändringar meddelar vi dig i tjänsten."],
      },
    ],
  };
}

function termsSv(): LegalDoc {
  const o = operator();
  return {
    title: "Användarvillkor",
    updated: "Senast uppdaterad: 1 november 2026",
    intro: `Dessa villkor gäller för användningen av tjänsten astrabela.com, som drivs av ${who()}. Genom att använda tjänsten eller skapa ett företagskonto godkänner du dem.`,
    sections: [
      {
        title: "1. Tjänsten",
        body: [
          "Astrabela låter kunder hitta skönhetssalonger, barberare och restauranger, boka behandlingar online, betygsätta behandlare och se restaurangers menyer. Salonger och restauranger hanterar sin profil, sitt team, sina behandlingar, sin kalender och sin meny i företagskontot.",
        ],
      },
      {
        title: "2. För kunder",
        body: [
          [
            "Det är gratis att använda Astrabela och kräver inget konto.",
            "En bokning är ett avtal mellan dig och salongen. Behandlingar, priser och tid bestäms av salongen, och behandlingen utförs av salongen, inte av Astrabela.",
            "Astrabela tar inte emot betalningar: du betalar direkt i salongen.",
            "Du kan avboka ditt besök via den personliga länk du får. Avboka gärna om du inte kan komma.",
          ],
        ],
      },
      {
        title: "3. Omdömen",
        body: [
          "Alla kunder som är inloggade på Astrabela kan betygsätta en behandlare på en salong, en gång var 30:e dag för samma behandlare. Kunder med ett besök bokat via Astrabela eller bekräftat av salongen kan också lämna omdömen via en personlig länk; dessa omdömen är märkta som bekräftat besök. Ett omdöme ska:",
          [
            "beskriva din egen, verkliga upplevelse;",
            "vara fritt från förolämpningar, hot och diskriminering;",
            "inte innehålla andras personuppgifter, reklam eller länkar.",
          ],
          "Vi kan dölja omdömen som bryter mot dessa regler. Salongen kan inte radera eller ändra omdömen; den kan svara offentligt eller anmäla ett omdöme för moderering.",
        ],
      },
      {
        title: "4. För salonger och restauranger",
        body: [
          [
            "Uppgifter i profilen, priser och meny ska vara korrekta och aktuella. Du ansvarar för dem och för dina tjänster.",
            "Skydda ditt lösenord; du ansvarar för aktiviteten på ditt konto.",
            "Skapa inte falska bokningar, omdömen eller förfrågningar om omdömen och be inte om omdömen mot en belöning.",
            "Bara profiler med aktivt abonnemang eller under provperioden visas i sökningen.",
          ],
        ],
      },
      {
        title: "5. Priser",
        body: [
          "För salonger, barberare och restauranger är de första 3 månaderna gratis, utan kort för att komma igång. Därefter krävs ett abonnemang för att synas:",
          PRICES.sv,
          "Betalningsvillkoren visas före varje debitering. Vi kan ändra priserna med minst 30 dagars varsel; ändringen gäller från nästa faktureringsperiod.",
        ],
      },
      {
        title: "6. Personuppgiftsbiträdesavtal (företag)",
        body: [
          "För kunduppgifter i bokningar är företaget personuppgiftsansvarigt och Astrabela personuppgiftsbiträde (art. 28 i GDPR). Astrabela:",
          [
            "behandlar uppgifterna bara för att tillhandahålla tjänsten och enligt de instruktioner företaget ger via tjänsten;",
            "håller dem konfidentiella och skyddar dem med lämpliga säkerhetsåtgärder;",
            "använder bara de underbiträden som anges i integritetspolicyn och meddelar företagen i förväg om nya;",
            "hjälper företaget med kunders begäranden och anmälan av personuppgiftsincidenter;",
            "raderar eller lämnar ut uppgifterna när kontot avslutas, om inte lagen kräver att de sparas.",
          ],
        ],
      },
      {
        title: "7. Avstängning och avslutande av konto",
        body: [
          "Du kan när som helst avsluta ditt företagskonto genom att skriva till oss. Vi kan stänga av eller ta bort en profil som bryter mot dessa villkor, lagen eller andras rättigheter, med angivande av skälet.",
        ],
      },
      {
        title: "8. Ansvar",
        body: [
          "Vi gör vårt bästa för att tjänsten ska vara tillgänglig och korrekt, men kan inte garantera att den alltid fungerar utan avbrott och fel. Astrabela är inte part i avtalet mellan kund och salong och ansvarar inte för salongens tjänster. Ingenting i dessa villkor begränsar konsumenters lagstadgade rättigheter.",
        ],
      },
      {
        title: "9. Tillämplig lag och klagomål",
        body: [
          `Villkoren lyder under portugisisk rätt, utan att det påverkar det skydd du som konsument har enligt lagen i det land där du bor. Klagomål skickas till ${o.email}.`,
        ],
      },
      {
        title: "10. Ändringar",
        body: ["Vi kan uppdatera dessa villkor. Den nya versionen publiceras här med datum; om viktiga ändringar meddelar vi företagen i förväg."],
      },
    ],
  };
}

function privacyNb(): LegalDoc {
  const o = operator();
  return {
    title: "Personvernerklæring",
    updated: "Sist oppdatert: 1. november 2026",
    intro:
      "Astrabela er en katalog over skjønnhetssalonger, barbersjapper og restauranter i Europa med nettbestilling og kundeanmeldelser av hver behandler. Denne erklæringen forklarer hvilke personopplysninger vi behandler, hvorfor, og hvilke rettigheter du har etter GDPR.",
    sections: [
      { title: "1. Hvem vi er", body: [`Tjenesten astrabela.com drives av ${who()}. Spørsmål om opplysningene dine kan sendes til ${o.email}.`] },
      {
        title: "2. Hvilke opplysninger vi behandler",
        body: [
          "Når du bestiller eller skriver en anmeldelse (kunder):",
          [
            "navn, e-post og mobilnummer som du oppgir ved bestilling, samt meldingen din til salongen;",
            "selve bestillingen: salong, behandler, behandling, dato, klokkeslett og status;",
            "anmeldelsen din: stjerner, tekst og navnet du vil vise;",
            "hvis du oppretter en kundekonto: navn og e-post samt et passord som bare lagres kryptert (hash), eller ved innlogging med Google ID-en til Google-kontoen din (vi ser aldri Google-passordet ditt).",
          ],
          "Når en salong eller restaurant bruker Astrabela (bedrifter):",
          [
            "kontoinnehaverens navn og e-post samt passord (bare lagret kryptert);",
            "bedriftens opplysninger: navn, adresse, telefon, e-post, organisasjonsnummer, team, behandlinger, priser, åpningstider, meny og lenker til sosiale medier.",
          ],
          "Tekniske opplysninger: informasjonskapsler for innlogging, en informasjonskapsel for språk og serverlogger (f.eks. IP-adresse og tidspunkt for forespørselen), som vi lagrer av sikkerhetshensyn.",
        ],
      },
      {
        title: "3. Formål og rettslig grunnlag",
        body: [
          [
            "gjennomføring og administrasjon av bestillinger: oppfyllelse av avtale (art. 6 nr. 1 bokstav b i GDPR);",
            "administrasjon av bedriftenes kontoer og abonnementer: oppfyllelse av avtale;",
            "publisering av anmeldelser og forebygging av falske anmeldelser: berettiget interesse i en pålitelig katalog (art. 6 nr. 1 bokstav f);",
            "sikker drift av tjenesten: berettiget interesse;",
            "skatte- og regnskapsplikter: rettslig forpliktelse (art. 6 nr. 1 bokstav c).",
          ],
          "Vi selger ikke personopplysninger og bruker dem ikke til reklame.",
        ],
      },
      {
        title: "4. Salongens rolle og vår rolle",
        body: [
          "Ved bestillinger er det salongen du velger, som bestemmer hvordan kundenes opplysninger brukes, og som er behandlingsansvarlig for dem. Astrabela behandler disse opplysningene på vegne av salongen som databehandler (art. 28 i GDPR) og bare for å levere tjenesten. For anmeldelser, den offentlige katalogen og tjenestens sikkerhet er Astrabela behandlingsansvarlig.",
        ],
      },
      {
        title: "5. Mottakere av opplysningene",
        body: [
          "Salongen eller restauranten du bestiller hos. Vi bruker også følgende leverandører, som er bundet av databehandleravtaler:",
          [
            "Vercel Inc. – drift; tjenesten kjører i Frankfurt (EU). Vercel er et amerikansk selskap; overføring utenfor EU/EØS er dekket av EUs standard personvernbestemmelser og EU-US Data Privacy Framework;",
            "Neon – database i Frankfurt (EU);",
            "Cloudflare – domenenavntjeneste (DNS);",
            "Google – bare hvis du logger inn med Google.",
          ],
        ],
      },
      {
        title: "6. Lagringstid",
        body: [
          [
            "kunde- og bestillingsopplysninger: så lenge salongens konto er aktiv, høyst 2 år etter ditt siste besøk;",
            "anmeldelser: så lenge salongen er på Astrabela;",
            "kundekontoer: til de slettes (knapp på kontosiden);",
            "bedriftskontoer: til kontoen avsluttes;",
            "fakturaer og betalingsopplysninger: 10 år etter portugisisk skatterett;",
            "bedrifters registreringsforespørsler: 30 dager.",
          ],
        ],
      },
      {
        title: "7. Informasjonskapsler",
        body: [
          "Vi bruker bare informasjonskapsler som er nødvendige for tjenesten: for å holde deg innlogget (og vise navnet ditt i menyen), kortvarige ved innlogging med Google, én for språket og én som husker rettene du liker i en restaurants meny (den opprettes først når du trykker på ♥, og inneholder en tilfeldig kode, ikke navnet ditt). Vi bruker ikke analyse- eller reklamekapsler og ber derfor ikke om samtykke til informasjonskapsler.",
        ],
      },
      {
        title: "8. Dine rettigheter",
        body: [
          `Du kan be om innsyn i opplysningene dine, retting eller sletting av dem, begrensning av behandlingen, protestere og få opplysningene dine i et overførbart format. Skriv til ${o.email}; vi svarer innen en måned. Hvis opplysningene er gitt videre til en salong, sender vi også forespørselen din videre dit. Du kan også klage til Datatilsynet (www.datatilsynet.no) eller til den portugisiske myndigheten CNPD (www.cnpd.pt).`,
        ],
      },
      {
        title: "9. Sikkerhet",
        body: [
          "Tjenesten kjører bare over HTTPS, passord lagres kryptert, og lenker til bestillinger og anmeldelser er personlige og vanskelige å gjette. Ikke del den personlige lenken din med andre.",
        ],
      },
      {
        title: "10. Endringer",
        body: ["Hvis vi endrer denne erklæringen, publiserer vi den nye versjonen her med dato. Om viktige endringer gir vi beskjed i tjenesten."],
      },
    ],
  };
}

function termsNb(): LegalDoc {
  const o = operator();
  return {
    title: "Vilkår for bruk",
    updated: "Sist oppdatert: 1. november 2026",
    intro: `Disse vilkårene gjelder for bruken av tjenesten astrabela.com, som drives av ${who()}. Ved å bruke tjenesten eller opprette en bedriftskonto godtar du dem.`,
    sections: [
      {
        title: "1. Tjenesten",
        body: [
          "Astrabela lar kunder finne skjønnhetssalonger, barbersjapper og restauranter, bestille behandlinger på nett, vurdere behandlere og se restaurantenes menyer. Salonger og restauranter administrerer profil, team, behandlinger, kalender og meny i bedriftskontoen.",
        ],
      },
      {
        title: "2. For kunder",
        body: [
          [
            "Det er gratis å bruke Astrabela, og det krever ingen konto.",
            "En bestilling er en avtale mellom deg og salongen. Behandlinger, priser og varighet fastsettes av salongen, og behandlingen utføres av salongen, ikke av Astrabela.",
            "Astrabela tar ikke imot betaling: du betaler direkte i salongen.",
            "Du kan avbestille besøket via den personlige lenken du får. Avbestill gjerne hvis du ikke kan komme.",
          ],
        ],
      },
      {
        title: "3. Anmeldelser",
        body: [
          "Alle kunder som er logget inn på Astrabela, kan vurdere en behandler i en salong, én gang hver 30. dag for samme behandler. Kunder med et besøk bestilt via Astrabela eller bekreftet av salongen kan også anmelde via en personlig lenke; disse anmeldelsene er merket som bekreftet besøk. En anmeldelse skal:",
          [
            "beskrive din egen, reelle opplevelse;",
            "være fri for fornærmelser, trusler og diskriminering;",
            "ikke inneholde andres personopplysninger, reklame eller lenker.",
          ],
          "Vi kan skjule anmeldelser som bryter disse reglene. Salongen kan ikke slette eller endre anmeldelser; den kan svare offentlig eller melde en anmeldelse til moderering.",
        ],
      },
      {
        title: "4. For salonger og restauranter",
        body: [
          [
            "Opplysninger i profilen, priser og meny skal være riktige og oppdaterte. Du er ansvarlig for dem og for tjenestene dine.",
            "Ta vare på passordet ditt; du er ansvarlig for aktiviteten på kontoen din.",
            "Ikke lag falske bestillinger, anmeldelser eller forespørsler om anmeldelser, og ikke be om anmeldelser mot en belønning.",
            "Bare profiler med aktivt abonnement eller i prøveperioden vises i søket.",
          ],
        ],
      },
      {
        title: "5. Priser",
        body: [
          "For salonger, barbersjapper og restauranter er de første 3 månedene gratis, uten kort for å komme i gang. Deretter kreves et abonnement for å bli vist:",
          PRICES.nb,
          "Betalingsvilkårene vises før hver belastning. Vi kan endre prisene med minst 30 dagers varsel; endringen gjelder fra neste faktureringsperiode.",
        ],
      },
      {
        title: "6. Databehandleravtale (bedrifter)",
        body: [
          "For kundeopplysninger i bestillinger er bedriften behandlingsansvarlig og Astrabela databehandler (art. 28 i GDPR). Astrabela:",
          [
            "behandler opplysningene bare for å levere tjenesten og etter instruksene bedriften gir via tjenesten;",
            "holder dem konfidensielle og beskytter dem med egnede sikkerhetstiltak;",
            "bruker bare underleverandørene som er nevnt i personvernerklæringen, og varsler bedriftene på forhånd om nye;",
            "hjelper bedriften med kunders forespørsler og varsling av brudd på personopplysningssikkerheten;",
            "sletter eller utleverer opplysningene når kontoen avsluttes, med mindre loven krever at de oppbevares.",
          ],
        ],
      },
      {
        title: "7. Suspensjon og avslutning av konto",
        body: [
          "Du kan når som helst avslutte bedriftskontoen din ved å skrive til oss. Vi kan suspendere eller fjerne en profil som bryter disse vilkårene, loven eller andres rettigheter, med angivelse av grunnen.",
        ],
      },
      {
        title: "8. Ansvar",
        body: [
          "Vi gjør vårt beste for at tjenesten skal være tilgjengelig og korrekt, men kan ikke garantere at den alltid fungerer uten avbrudd og feil. Astrabela er ikke part i avtalen mellom kunde og salong og er ikke ansvarlig for salongens tjenester. Ingenting i disse vilkårene begrenser forbrukeres lovfestede rettigheter.",
        ],
      },
      {
        title: "9. Lovvalg og klager",
        body: [
          `Vilkårene er underlagt portugisisk rett, uten at det påvirker vernet du som forbruker har etter loven i landet der du bor. Klager kan sendes til ${o.email}.`,
        ],
      },
      {
        title: "10. Endringer",
        body: ["Vi kan oppdatere disse vilkårene. Den nye versjonen publiseres her med dato; om viktige endringer varsler vi bedriftene på forhånd."],
      },
    ],
  };
}

function privacyFi(): LegalDoc {
  const o = operator();
  return {
    title: "Tietosuojaseloste",
    updated: "Päivitetty viimeksi: 1.11.2026",
    intro:
      "Astrabela on luettelo Euroopan kauneushoitoloista, parturiliikkeistä ja ravintoloista, jossa voi varata ajan verkossa ja lukea asiakkaiden arvioita jokaisesta tekijästä. Tämä seloste kertoo, mitä henkilötietoja käsittelemme, miksi ja mitä oikeuksia sinulla on GDPR:n mukaan.",
    sections: [
      { title: "1. Keitä olemme", body: [`Palvelua astrabela.com ylläpitää ${who()}. Tietojasi koskevat kysymykset voit lähettää osoitteeseen ${o.email}.`] },
      {
        title: "2. Mitä tietoja käsittelemme",
        body: [
          "Kun varaat ajan tai kirjoitat arvion (asiakkaat):",
          [
            "varauksen yhteydessä antamasi nimi, sähköposti ja matkapuhelinnumero sekä viestisi liikkeelle;",
            "itse varaus: liike, tekijä, palvelu, päivä, kellonaika ja tila;",
            "arviosi: tähdet, teksti ja nimi, jonka haluat näyttää;",
            "jos luot asiakastilin: nimi ja sähköposti sekä salasana, joka tallennetaan vain salattuna (tiiviste), tai Google-kirjautumisessa Google-tilisi tunniste (emme koskaan näe Google-salasanaasi).",
          ],
          "Kun liike tai ravintola käyttää Astrabelaa (yritykset):",
          [
            "tilin haltijan nimi ja sähköposti sekä salasana (tallennetaan vain salattuna);",
            "yrityksen tiedot: nimi, osoite, puhelin, sähköposti, Y-tunnus, tiimi, palvelut, hinnat, aukioloajat, ruokalista ja linkit sosiaaliseen mediaan.",
          ],
          "Tekniset tiedot: kirjautumisevästeet, kielievästeet ja palvelinlokit (esim. IP-osoite ja pyynnön ajankohta), joita säilytämme tietoturvasyistä.",
        ],
      },
      {
        title: "3. Käsittelyn tarkoitukset ja perusteet",
        body: [
          [
            "varausten toteuttaminen ja hallinta: sopimuksen täytäntöönpano (GDPR 6 artiklan 1 kohdan b alakohta);",
            "yritysten tilien ja tilausten hallinta: sopimuksen täytäntöönpano;",
            "arvioiden julkaiseminen ja väärennettyjen arvioiden estäminen: oikeutettu etu luotettavaan luetteloon (6 artiklan 1 kohdan f alakohta);",
            "palvelun turvallinen toiminta: oikeutettu etu;",
            "vero- ja kirjanpitovelvoitteet: lakisääteinen velvoite (6 artiklan 1 kohdan c alakohta).",
          ],
          "Emme myy henkilötietoja emmekä käytä niitä mainontaan.",
        ],
      },
      {
        title: "4. Liikkeen rooli ja meidän roolimme",
        body: [
          "Varauksissa valitsemasi liike päättää, miten sen asiakkaiden tietoja käytetään, ja on niiden rekisterinpitäjä. Astrabela käsittelee näitä tietoja liikkeen puolesta henkilötietojen käsittelijänä (GDPR 28 artikla) ja vain palvelun tarjoamiseksi. Arvioiden, julkisen luettelon ja palvelun turvallisuuden osalta rekisterinpitäjä on Astrabela.",
        ],
      },
      {
        title: "5. Tietojen vastaanottajat",
        body: [
          "Liike tai ravintola, josta varaat. Käytämme lisäksi seuraavia palveluntarjoajia, joita sitovat tietojenkäsittelysopimukset:",
          [
            "Vercel Inc. – palvelinpalvelut; palvelu toimii Frankfurtissa (EU). Vercel on yhdysvaltalainen yhtiö; siirrot EU:n ulkopuolelle perustuvat EU:n vakiosopimuslausekkeisiin ja EU-US Data Privacy Framework -järjestelyyn;",
            "Neon – tietokanta Frankfurtissa (EU);",
            "Cloudflare – verkkotunnuspalvelu (DNS);",
            "Google – vain jos kirjaudut Googlella.",
          ],
        ],
      },
      {
        title: "6. Säilytysaika",
        body: [
          [
            "asiakas- ja varaustiedot: niin kauan kuin liikkeen tili on aktiivinen, enintään 2 vuotta viimeisestä käynnistäsi;",
            "arviot: niin kauan kuin liike on Astrabelassa;",
            "asiakastilit: kunnes ne poistetaan (painike tilisivulla);",
            "yritystilit: kunnes tili suljetaan;",
            "laskut ja maksutiedot: 10 vuotta Portugalin verolainsäädännön mukaan;",
            "yritysten rekisteröitymispyynnöt: 30 päivää.",
          ],
        ],
      },
      {
        title: "7. Evästeet",
        body: [
          "Käytämme vain palvelun toiminnalle välttämättömiä evästeitä: kirjautumisen ylläpitoon (ja nimesi näyttämiseen valikossa), lyhytaikaisia Google-kirjautumisessa, yhtä kielelle ja yhtä, joka muistaa ravintolan ruokalistasta pitämäsi annokset (se luodaan vasta, kun napautat ♥, ja se sisältää satunnaisen koodin, ei nimeäsi). Emme käytä analytiikka- tai mainosevästeitä, joten emme pyydä suostumusta evästeisiin.",
        ],
      },
      {
        title: "8. Oikeutesi",
        body: [
          `Voit pyytää pääsyä tietoihisi, niiden oikaisemista tai poistamista, käsittelyn rajoittamista, vastustaa käsittelyä ja saada tietosi siirrettävässä muodossa. Kirjoita osoitteeseen ${o.email}; vastaamme kuukauden kuluessa. Jos tiedot on luovutettu liikkeelle, välitämme pyyntösi myös sille. Voit myös tehdä valituksen tietosuojavaltuutetun toimistolle (tietosuoja.fi) tai Portugalin valvontaviranomaiselle CNPD (www.cnpd.pt).`,
        ],
      },
      {
        title: "9. Tietoturva",
        body: [
          "Palvelu toimii vain HTTPS-yhteydellä, salasanat tallennetaan salattuina, ja varaus- ja arviolinkit ovat henkilökohtaisia ja vaikeasti arvattavia. Älä jaa henkilökohtaista linkkiäsi muille.",
        ],
      },
      {
        title: "10. Muutokset",
        body: ["Jos muutamme tätä selostetta, julkaisemme uuden version tässä päivämäärän kanssa. Tärkeistä muutoksista kerromme palvelussa."],
      },
    ],
  };
}

function termsFi(): LegalDoc {
  const o = operator();
  return {
    title: "Käyttöehdot",
    updated: "Päivitetty viimeksi: 1.11.2026",
    intro: `Nämä ehdot koskevat palvelun astrabela.com käyttöä. Palvelua ylläpitää ${who()}. Käyttämällä palvelua tai luomalla yritystilin hyväksyt ehdot.`,
    sections: [
      {
        title: "1. Palvelu",
        body: [
          "Astrabelan avulla asiakkaat löytävät kauneushoitoloita, parturiliikkeitä ja ravintoloita, varaavat palveluita verkossa, arvioivat tekijöitä ja katsovat ravintoloiden ruokalistoja. Liikkeet ja ravintolat hallinnoivat yritystilillään profiiliaan, tiimiään, palveluitaan, kalenteriaan ja ruokalistaansa.",
        ],
      },
      {
        title: "2. Asiakkaille",
        body: [
          [
            "Astrabelan käyttö on maksutonta eikä vaadi tiliä.",
            "Varaus on sopimus sinun ja liikkeen välillä. Liike päättää palveluista, hinnoista ja kestosta, ja palvelun tuottaa liike, ei Astrabela.",
            "Astrabela ei ota vastaan maksuja: maksat suoraan liikkeessä.",
            "Voit perua käynnin saamasi henkilökohtaisen linkin kautta. Peru käynti, jos et pääse paikalle.",
          ],
        ],
      },
      {
        title: "3. Arviot",
        body: [
          "Jokainen Astrabelaan kirjautunut asiakas voi arvioida liikkeen tekijän kerran 30 päivässä samaa tekijää kohden. Asiakkaat, joiden käynti on varattu Astrabelan kautta tai liikkeen vahvistama, voivat arvioida myös henkilökohtaisen linkin kautta; näissä arvioissa on merkintä vahvistetusta käynnistä. Arvion on:",
          [
            "kuvattava omaa, todellista kokemustasi;",
            "oltava vapaa loukkauksista, uhkauksista ja syrjinnästä;",
            "oltava sisältämättä muiden henkilötietoja, mainoksia tai linkkejä.",
          ],
          "Voimme piilottaa näitä sääntöjä rikkovat arviot. Liike ei voi poistaa tai muuttaa arvioita; se voi vastata julkisesti tai ilmoittaa arviosta moderointiin.",
        ],
      },
      {
        title: "4. Liikkeille ja ravintoloille",
        body: [
          [
            "Profiilin tietojen, hintojen ja ruokalistan on oltava oikeita ja ajan tasalla. Vastaat niistä ja palveluistasi.",
            "Pidä salasanasi tallessa; vastaat tililläsi tapahtuvasta toiminnasta.",
            "Älä luo vääriä varauksia, arvioita tai arviopyyntöjä äläkä pyydä arvioita palkkiota vastaan.",
            "Haussa näytetään vain profiilit, joilla on voimassa oleva tilaus tai kokeilujakso.",
          ],
        ],
      },
      {
        title: "5. Hinnat",
        body: [
          "Liikkeille, parturiliikkeille ja ravintoloille 3 ensimmäistä kuukautta ovat maksuttomia, eikä aloittamiseen tarvita korttia. Sen jälkeen näkyminen edellyttää tilausta:",
          PRICES.fi,
          "Maksuehdot näytetään ennen jokaista veloitusta. Voimme muuttaa hintoja vähintään 30 päivän ilmoitusajalla; muutos koskee seuraavaa laskutuskautta.",
        ],
      },
      {
        title: "6. Tietojenkäsittelysopimus (yritykset)",
        body: [
          "Varausten asiakastietojen osalta yritys on rekisterinpitäjä ja Astrabela henkilötietojen käsittelijä (GDPR 28 artikla). Astrabela:",
          [
            "käsittelee tietoja vain palvelun tarjoamiseksi ja yrityksen palvelun kautta antamien ohjeiden mukaisesti;",
            "pitää ne luottamuksellisina ja suojaa ne asianmukaisin turvatoimin;",
            "käyttää vain tietosuojaselosteessa mainittuja alikäsittelijöitä ja ilmoittaa uusista yrityksille etukäteen;",
            "auttaa yritystä asiakkaiden pyynnöissä ja tietoturvaloukkauksista ilmoittamisessa;",
            "poistaa tai luovuttaa tiedot tilin sulkemisen jälkeen, ellei laki edellytä niiden säilyttämistä.",
          ],
        ],
      },
      {
        title: "7. Tilin jäädyttäminen ja sulkeminen",
        body: [
          "Voit sulkea yritystilisi milloin tahansa kirjoittamalla meille. Voimme jäädyttää tai poistaa profiilin, joka rikkoo näitä ehtoja, lakia tai muiden oikeuksia, ja kerromme syyn.",
        ],
      },
      {
        title: "8. Vastuu",
        body: [
          "Pyrimme siihen, että palvelu on saatavilla ja oikein, mutta emme voi taata, että se toimii aina ilman katkoja ja virheitä. Astrabela ei ole osapuoli asiakkaan ja liikkeen välisessä sopimuksessa eikä vastaa liikkeen palveluista. Mikään näissä ehdoissa ei rajoita kuluttajien lakisääteisiä oikeuksia.",
        ],
      },
      {
        title: "9. Sovellettava laki ja valitukset",
        body: [
          `Ehtoihin sovelletaan Portugalin lakia, rajoittamatta suojaa, joka sinulla on kuluttajana asuinmaasi lain mukaan. Valitukset voit lähettää osoitteeseen ${o.email}.`,
        ],
      },
      {
        title: "10. Muutokset",
        body: ["Voimme päivittää näitä ehtoja. Uusi versio julkaistaan tässä päivämäärän kanssa; tärkeistä muutoksista ilmoitamme yrityksille etukäteen."],
      },
    ],
  };
}

function privacyEt(): LegalDoc {
  const o = operator();
  return {
    title: "Privaatsuspoliitika",
    updated: "Viimati uuendatud: 1. november 2026",
    intro:
      "Astrabela on Euroopa ilusalongide, juuksurite-barbershoppide ja restoranide kataloog, kus saab broneerida veebis ja lugeda klientide arvustusi iga teenindaja kohta. See poliitika selgitab, milliseid isikuandmeid me töötleme, miks ja millised on sinu õigused GDPR-i järgi.",
    sections: [
      { title: "1. Kes me oleme", body: [`Teenust astrabela.com haldab ${who()}. Küsimused oma andmete kohta saad saata aadressile ${o.email}.`] },
      {
        title: "2. Milliseid andmeid me töötleme",
        body: [
          "Kui broneerid või kirjutad arvustuse (kliendid):",
          [
            "broneerimisel sisestatud nimi, e-post ja mobiilinumber ning sinu sõnum salongile;",
            "broneering ise: salong, teenindaja, teenus, kuupäev, kellaaeg ja olek;",
            "sinu arvustus: tärnid, tekst ja nimi, mida soovid näidata;",
            "kui lood kliendikonto: nimi ja e-post ning parool, mida hoitakse ainult krüpteeritult (räsi), või Google'iga sisselogimisel sinu Google'i konto identifikaator (sinu Google'i parooli me kunagi ei näe).",
          ],
          "Kui salong või restoran kasutab Astrabelat (ettevõtted):",
          [
            "konto omaniku nimi ja e-post ning parool (hoitakse ainult krüpteeritult);",
            "ettevõtte andmed: nimi, aadress, telefon, e-post, registrikood, meeskond, teenused, hinnad, lahtiolekuajad, menüü ja lingid sotsiaalmeediale.",
          ],
          "Tehnilised andmed: sisselogimise küpsised, keele küpsis ja serverilogid (nt IP-aadress ja päringu aeg), mida hoiame turvalisuse huvides.",
        ],
      },
      {
        title: "3. Eesmärgid ja õiguslikud alused",
        body: [
          [
            "broneeringute tegemine ja haldamine: lepingu täitmine (GDPR art 6 lg 1 p b);",
            "ettevõtete kontode ja tellimuste haldamine: lepingu täitmine;",
            "arvustuste avaldamine ja võltsarvustuste ennetamine: õigustatud huvi usaldusväärse kataloogi vastu (art 6 lg 1 p f);",
            "teenuse turvaline toimimine: õigustatud huvi;",
            "maksu- ja raamatupidamiskohustused: juriidiline kohustus (art 6 lg 1 p c).",
          ],
          "Me ei müü isikuandmeid ega kasuta neid reklaamiks.",
        ],
      },
      {
        title: "4. Salongi roll ja meie roll",
        body: [
          "Broneeringute puhul otsustab sinu valitud salong, kuidas tema klientide andmeid kasutatakse, ja on nende vastutav töötleja. Astrabela töötleb neid andmeid salongi nimel volitatud töötlejana (GDPR art 28) ja ainult teenuse osutamiseks. Arvustuste, avaliku kataloogi ja teenuse turvalisuse osas on vastutav töötleja Astrabela.",
        ],
      },
      {
        title: "5. Andmete saajad",
        body: [
          "Salong või restoran, kus broneerid. Kasutame ka järgmisi teenusepakkujaid, keda seovad andmetöötluslepingud:",
          [
            "Vercel Inc. – majutus; teenus töötab Frankfurdis (EL). Vercel on Ameerika ettevõte; andmete edastamine väljapoole ELi on kaetud ELi tüüptingimuste ja EU-US Data Privacy Frameworkiga;",
            "Neon – andmebaas Frankfurdis (EL);",
            "Cloudflare – domeeninimeteenus (DNS);",
            "Google – ainult siis, kui logid sisse Google'iga.",
          ],
        ],
      },
      {
        title: "6. Säilitamise aeg",
        body: [
          [
            "klientide ja broneeringute andmed: kuni salongi konto on aktiivne, kuid mitte kauem kui 2 aastat pärast sinu viimast külastust;",
            "arvustused: kuni salong on Astrabelas;",
            "kliendikontod: kuni kustutamiseni (nupp konto lehel);",
            "ettevõtete kontod: kuni konto sulgemiseni;",
            "arved ja makseandmed: 10 aastat Portugali maksuõiguse järgi;",
            "ettevõtete registreerimistaotlused: 30 päeva.",
          ],
        ],
      },
      {
        title: "7. Küpsised",
        body: [
          "Kasutame ainult teenuse toimimiseks vajalikke küpsiseid: sisselogituna püsimiseks (ja sinu nime näitamiseks menüüs), lühiajalisi Google'iga sisselogimisel, ühte keele jaoks ja ühte, mis jätab meelde restorani menüüs sulle meeldinud road (see luuakse alles siis, kui puudutad ♥, ja sisaldab juhuslikku koodi, mitte sinu nime). Me ei kasuta analüütika- ega reklaamiküpsiseid ega küsi seetõttu küpsiste jaoks nõusolekut.",
        ],
      },
      {
        title: "8. Sinu õigused",
        body: [
          `Võid taotleda juurdepääsu oma andmetele, nende parandamist või kustutamist, töötlemise piiramist, esitada vastuväiteid ja saada oma andmed ülekantavas vormingus. Kirjuta aadressile ${o.email}; vastame ühe kuu jooksul. Kui andmed on edastatud salongile, edastame ka sinu taotluse talle. Kaebuse võid esitada ka Andmekaitse Inspektsioonile (www.aki.ee) või Portugali järelevalveasutusele CNPD (www.cnpd.pt).`,
        ],
      },
      {
        title: "9. Turvalisus",
        body: [
          "Teenus töötab ainult HTTPS-i kaudu, paroole hoitakse krüpteeritult ning broneeringute ja arvustuste lingid on isiklikud ja raskesti äraarvatavad. Ära jaga oma isiklikku linki teistega.",
        ],
      },
      {
        title: "10. Muudatused",
        body: ["Kui muudame seda poliitikat, avaldame siin uue versiooni koos kuupäevaga. Olulistest muudatustest teatame teenuses."],
      },
    ],
  };
}

function termsEt(): LegalDoc {
  const o = operator();
  return {
    title: "Kasutustingimused",
    updated: "Viimati uuendatud: 1. november 2026",
    intro: `Need tingimused reguleerivad teenuse astrabela.com kasutamist. Teenust haldab ${who()}. Teenust kasutades või ettevõtte kontot luues nõustud nendega.`,
    sections: [
      {
        title: "1. Teenus",
        body: [
          "Astrabela võimaldab klientidel leida ilusalonge, barbershoppe ja restorane, broneerida teenuseid veebis, hinnata teenindajaid ja vaadata restoranide menüüsid. Salongid ja restoranid haldavad ettevõtte kontol oma profiili, meeskonda, teenuseid, kalendrit ja menüüd.",
        ],
      },
      {
        title: "2. Klientidele",
        body: [
          [
            "Astrabela kasutamine on tasuta ega nõua kontot.",
            "Broneering on leping sinu ja salongi vahel. Teenused, hinnad ja kestuse määrab salong ning teenust osutab salong, mitte Astrabela.",
            "Astrabela ei võta makseid vastu: maksad otse salongis.",
            "Külastuse saad tühistada saadud isikliku lingi kaudu. Palun tühista, kui sa ei saa tulla.",
          ],
        ],
      },
      {
        title: "3. Arvustused",
        body: [
          "Iga Astrabelasse sisse logitud klient võib hinnata salongi teenindajat üks kord 30 päeva jooksul sama teenindaja kohta. Kliendid, kelle külastus on broneeritud Astrabela kaudu või salongi poolt kinnitatud, võivad arvustada ka isikliku lingi kaudu; neil arvustustel on kinnitatud külastuse märge. Arvustus peab:",
          [
            "kirjeldama sinu enda tegelikku kogemust;",
            "olema vaba solvangutest, ähvardustest ja diskrimineerimisest;",
            "mitte sisaldama teiste isikuandmeid, reklaami ega linke.",
          ],
          "Võime peita arvustused, mis neid reegleid rikuvad. Salong ei saa arvustusi kustutada ega muuta; ta võib vastata avalikult või teatada arvustusest modereerimiseks.",
        ],
      },
      {
        title: "4. Salongidele ja restoranidele",
        body: [
          [
            "Profiili andmed, hinnad ja menüü peavad olema õiged ja ajakohased. Vastutad nende ja oma teenuste eest.",
            "Hoia oma parool turvaliselt; vastutad oma kontol toimuva eest.",
            "Ära loo võltsbroneeringuid, -arvustusi ega -arvustuse palveid ega küsi arvustusi tasu eest.",
            "Otsingus kuvatakse ainult aktiivse tellimuse või prooviperioodiga profiile.",
          ],
        ],
      },
      {
        title: "5. Hinnad",
        body: [
          "Salongidele, barbershoppidele ja restoranidele on esimesed 3 kuud tasuta, alustamiseks pole kaarti vaja. Seejärel on nähtavaks jäämiseks vaja tellimust:",
          PRICES.et,
          "Maksetingimused kuvatakse enne iga makset. Võime hindu muuta vähemalt 30-päevase etteteatamisega; muudatus kehtib järgmisest arveldusperioodist.",
        ],
      },
      {
        title: "6. Andmetöötlusleping (ettevõtted)",
        body: [
          "Broneeringutes olevate kliendiandmete puhul on ettevõte vastutav töötleja ja Astrabela volitatud töötleja (GDPR art 28). Astrabela:",
          [
            "töötleb neid andmeid ainult teenuse osutamiseks ja ettevõtte poolt teenuse kaudu antud juhiste järgi;",
            "hoiab need konfidentsiaalsena ja kaitseb neid sobivate turvameetmetega;",
            "kasutab ainult privaatsuspoliitikas nimetatud alamtöötlejaid ja teavitab ettevõtteid uutest ette;",
            "aitab ettevõtet klientide taotluste ja andmetega seotud rikkumistest teatamise korral;",
            "kustutab või annab andmed üle pärast konto sulgemist, välja arvatud juhul, kui seadus nõuab nende säilitamist.",
          ],
        ],
      },
      {
        title: "7. Konto peatamine ja sulgemine",
        body: [
          "Saad ettevõtte konto igal ajal sulgeda, kui meile kirjutad. Võime peatada või eemaldada profiili, mis rikub neid tingimusi, seadust või teiste õigusi, põhjust märkides.",
        ],
      },
      {
        title: "8. Vastutus",
        body: [
          "Püüame, et teenus oleks kättesaadav ja õige, kuid ei saa tagada, et see töötab alati katkestuste ja vigadeta. Astrabela ei ole kliendi ja salongi vahelise lepingu pool ega vastuta salongi teenuste eest. Miski nendes tingimustes ei piira tarbijate seadusest tulenevaid õigusi.",
        ],
      },
      {
        title: "9. Kohaldatav õigus ja kaebused",
        body: [
          `Tingimustele kohaldatakse Portugali õigust, ilma et see piiraks kaitset, mis sul on tarbijana oma elukohariigi õiguse järgi. Kaebused saada aadressile ${o.email}.`,
        ],
      },
      {
        title: "10. Muudatused",
        body: ["Võime neid tingimusi uuendada. Uus versioon avaldatakse siin koos kuupäevaga; olulistest muudatustest teavitame ettevõtteid ette."],
      },
    ],
  };
}

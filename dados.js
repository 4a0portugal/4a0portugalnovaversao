function slugify(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferirClube(id, nomeEquipa) {
  const base = String(id || "").toLowerCase();

  const mapa = {
    por: "porto",
    fcp: "porto",
    slb: "benfica",
    scp: "sporting",
    bel: "belenenses",
    boa: "boavista",
    scb: "braga",
    vsc: "vitoria-sc",
    cfb: "estrela-amadora",
    sal: "salgueiros",
    far: "farense",
    cam: "campomaiorense",
    bei: "beira-mar",
    lei: "leiria-leixoes",
    set: "vitoria-setubal",
    aca: "academica",
    pac: "pacos-ferreira",
    ave: "aves",
    tor: "torreense",
    rm: "real-madrid",
    manc: "manchester-city",
    liv: "liverpool",
    bay: "bayern",
    int: "inter-milao",
    juv: "juventus",
    acm: "ac-milan",
    psv: "psv",
    lyo: "lyon",
    val: "valencia",
    dep: "deportivo-corunha",
    mon: "monaco",
    lev: "bayer-leverkusen",
    fcb: "barcelona",
    ajx: "ajax",
    che: "chelsea",
    tot: "tottenham",
    atm: "atletico-madrid",
    par: "psg",
    bvb: "borussia-dortmund"
  };

  const prefixo = base.split("_")[0];
  if (mapa[prefixo]) return mapa[prefixo];

  return slugify(
    String(nomeEquipa || "")
      .replace(/\s+\d{4}$/, "")
      .replace(/\s+All-Time$/i, "")
      .trim()
  );
}

function inferirEpoca(id, nomeEquipa) {
  const texto = `${id || ""} ${nomeEquipa || ""}`;
  const match = texto.match(/(19\d{2}|20\d{2}|21\d{2})/);
  if (!match) return null;

  const ano = Number(match[1]);
  if (ano === 2111) return 2011;

  return ano;
}

function inferirCategoria(id, nomeEquipa) {
  const texto = `${id || ""} ${nomeEquipa || ""}`.toLowerCase();
  if (texto.includes("alltime") || texto.includes("all-time")) return "all-time";
  return "historica";
}

function inferirPool(equipa) {
  return equipa.isChampionsOnly === true || equipa.isChampionsOnly === "true"
    ? "champions"
    : "domestic";
}

function normalizarJogador(jogador, equipaId, indice) {
  const nome = jogador.nome || jogador.name || `Jogador ${indice + 1}`;
  const posicoes = Array.isArray(jogador.posicoes) ? jogador.posicoes : [];
  const ovr = Number(jogador.ovr) || 0;

  return {
    id: `${equipaId}-${slugify(nome)}-${indice}`,
    nome,
    posicoes,
    ovr
  };
}

function normalizarEquipa(equipa) {
  const id = equipa.id || slugify(equipa.nomeEquipa || "equipa-sem-id");
  const nomeEquipa = equipa.nomeEquipa || equipa.name || "Equipa sem nome";
  const clube = inferirClube(id, nomeEquipa);
  const epoca = inferirEpoca(id, nomeEquipa);
  const categoria = inferirCategoria(id, nomeEquipa);
  const pool = inferirPool(equipa);

  return {
    id,
    clube,
    epoca,
    nomeEquipa,
    categoria,
    pool,
    isChampionsOnly: pool === "champions",
    jogadores: Array.isArray(equipa.jogadores)
      ? equipa.jogadores.map((jogador, indice) =>
          normalizarJogador(jogador, id, indice)
        )
      : []
  };
}

const RAW_DATABASE = [
  // ==========================================
  // PARTE 1: FC PORTO (12 EQUIPAS)
  // ==========================================
  {
    "id": "por_1978",
    "nomeEquipa": "Porto 1978",
    "jogadores": [
      { "nome": "Fonseca", "posicoes": ["GR"], "ovr": 80 },
      { "nome": "Torres", "posicoes": ["GR"], "ovr": 72 },
      { "nome": "Gabriel", "posicoes": ["DD"], "ovr": 81 },
      { "nome": "Teixeirinha", "posicoes": ["DD", "DE"], "ovr": 74 },
      { "nome": "João Pinto", "posicoes": ["DD"], "ovr": 75 },
      { "nome": "Carlos Simões", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Alfredo Murça", "posicoes": ["DC", "DE"], "ovr": 80 },
      { "nome": "Freitas", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Liminha", "posicoes": ["DE"], "ovr": 75 },
      { "nome": "Rodolfo Reis", "posicoes": ["MC"], "ovr": 81 },
      { "nome": "António Oliveira", "posicoes": ["MC"], "ovr": 88 },
      { "nome": "Octávio Machado", "posicoes": ["MC"], "ovr": 82 },
      { "nome": "Frasco", "posicoes": ["MC"], "ovr": 81 },
      { "nome": "Ademir Vieira", "posicoes": ["MC"], "ovr": 77 },
      { "nome": "Celso", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Seninho", "posicoes": ["EXD", "EXE"], "ovr": 84 },
      { "nome": "Duda", "posicoes": ["EXE", "EXD"], "ovr": 82 },
      { "nome": "Taí", "posicoes": ["EXD"], "ovr": 74 },
      { "nome": "Vital", "posicoes": ["PL"], "ovr": 75 },
      { "nome": "Fernando Gomes", "posicoes": ["PL"], "ovr": 88 },
      { "nome": "Mário Gonzalez", "posicoes": ["PL"], "ovr": 78 },
      { "nome": "Nazaré", "posicoes": ["PL"], "ovr": 76 },
      { "nome": "Mirobaldo", "posicoes": ["PL"], "ovr": 78 }
    ]
  },
  {
    "id": "por_1987",
    "nomeEquipa": "Porto 1987",
    "jogadores": [
      { "nome": "Józef Młynarczyk", "posicoes": ["GR"], "ovr": 84 },
      { "nome": "Zé Beto", "posicoes": ["GR"], "ovr": 77 },
      { "nome": "João Pinto", "posicoes": ["DD"], "ovr": 88 },
      { "nome": "Bandeirinha", "posicoes": ["DD", "MC"], "ovr": 76 },
      { "nome": "Celso Vieira", "posicoes": ["DC"], "ovr": 84 },
      { "nome": "Eduardo Luís", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Lima Pereira", "posicoes": ["DC"], "ovr": 79 },
      { "nome": "Festas", "posicoes": ["DC"], "ovr": 71 },
      { "nome": "Augusto Inácio", "posicoes": ["DE"], "ovr": 83 },
      { "nome": "Laureta", "posicoes": ["DE"], "ovr": 73 },
      { "nome": "António André", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Quim", "posicoes": ["MC"], "ovr": 83 },
      { "nome": "António Sousa", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Frasco", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Elói", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Vermelhinho", "posicoes": ["EXE"], "ovr": 77 },
      { "nome": "Paulo Futre", "posicoes": ["EXE", "EXD"], "ovr": 93 },
      { "nome": "Rabah Madjer", "posicoes": ["EXD", "PL"], "ovr": 91 },
      { "nome": "Jaime Magalhães", "posicoes": ["EXD"], "ovr": 84 },
      { "nome": "Fernando Gomes", "posicoes": ["PL"], "ovr": 90 },
      { "nome": "Juary", "posicoes": ["PL"], "ovr": 84 },
      { "nome": "Walter Casagrande", "posicoes": ["PL"], "ovr": 76 }
    ]
  },
  {
    "id": "por_1995",
    "nomeEquipa": "Porto 1995",
    "jogadores": [
      { "nome": "Vítor Baía", "posicoes": ["GR"], "ovr": 88 },
      { "nome": "Lars Eriksson", "posicoes": ["GR"], "ovr": 74 },
      { "nome": "Carlos Secretário", "posicoes": ["DD"], "ovr": 80 },
      { "nome": "João Pinto", "posicoes": ["DD"], "ovr": 80 },
      { "nome": "Aloísio", "posicoes": ["DC"], "ovr": 84 },
      { "nome": "Jorge Costa", "posicoes": ["DC"], "ovr": 85 },
      { "nome": "Zé Carlos", "posicoes": ["DC"], "ovr": 77 },
      { "nome": "Rui Jorge", "posicoes": ["DE"], "ovr": 78 },
      { "nome": "Paulinho Santos", "posicoes": ["DE", "MC"], "ovr": 80 },
      { "nome": "Emerson", "posicoes": ["MC"], "ovr": 82 },
      { "nome": "Rui Barros", "posicoes": ["MC"], "ovr": 84 },
      { "nome": "Latapy", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Kulkov", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Bino", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Vinho", "posicoes": ["MC"], "ovr": 72 },
      { "nome": "Semes", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "António Folha", "posicoes": ["EXE"], "ovr": 81 },
      { "nome": "Ljubinko Drulović", "posicoes": ["EXE"], "ovr": 83 },
      { "nome": "Jorge Couto", "posicoes": ["EXD"], "ovr": 75 },
      { "nome": "Emil Kostadinov", "posicoes": ["EXD", "PL"], "ovr": 85 },
      { "nome": "Yuran", "posicoes": ["PL"], "ovr": 82 },
      { "nome": "Domingos Paciência", "posicoes": ["PL"], "ovr": 86 },
      { "nome": "Ronald Baroni", "posicoes": ["PL"], "ovr": 71 }
    ]
  },
  {
    "id": "por_1999",
    "nomeEquipa": "Porto 1999",
    "jogadores": [
      { "nome": "Ivica Kralj", "posicoes": ["GR"], "ovr": 76 },
      { "nome": "Rui Correia", "posicoes": ["GR"], "ovr": 75 },
      { "nome": "Vítor Baía", "posicoes": ["GR"], "ovr": 87 },
      { "nome": "Carlos Secretário", "posicoes": ["DD"], "ovr": 78 },
      { "nome": "Jorge Costa", "posicoes": ["DC"], "ovr": 86 },
      { "nome": "Aloísio", "posicoes": ["DC"], "ovr": 80 },
      { "nome": "João Manuel Pinto", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Carlos Dombray", "posicoes": ["DC"], "ovr": 71 },
      { "nome": "Esquerdinha", "posicoes": ["DE"], "ovr": 77 },
      { "nome": "Fernando Nélson", "posicoes": ["DE"], "ovr": 74 },
      { "nome": "Doriva", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Zlatko Zahovič", "posicoes": ["MC"], "ovr": 87 },
      { "nome": "Paulinho Santos", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Peixe", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Chippo", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Paulão", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Fandinho", "posicoes": ["MC"], "ovr": 71 },
      { "nome": "Capucho", "posicoes": ["EXD"], "ovr": 84 },
      { "nome": "Ljubinko Drulović", "posicoes": ["EXE"], "ovr": 85 },
      { "nome": "Alessandro Cambalhota", "posicoes": ["EXE", "PL"], "ovr": 75 },
      { "nome": "Mário Jardel", "posicoes": ["PL"], "ovr": 93 },
      { "nome": "Mielcarski", "posicoes": ["PL"], "ovr": 76 },
      { "nome": "Quinzinho", "posicoes": ["PL"], "ovr": 73 }
    ]
  },
  {
    "id": "por_2003",
    "nomeEquipa": "Porto 2003",
    "jogadores": [
      { "nome": "Vítor Baía", "posicoes": ["GR"], "ovr": 87 },
      { "nome": "Nuno Espírito Santo", "posicoes": ["GR"], "ovr": 73 },
      { "nome": "Paulo Ferreira", "posicoes": ["DD"], "ovr": 83 },
      { "nome": "Secretário", "posicoes": ["DD"], "ovr": 74 },
      { "nome": "Jorge Costa", "posicoes": ["DC"], "ovr": 85 },
      { "nome": "Ricardo Carvalho", "posicoes": ["DC"], "ovr": 88 },
      { "nome": "Pedro Emanuel", "posicoes": ["DC"], "ovr": 79 },
      { "nome": "Ricardo Costa", "posicoes": ["DC"], "ovr": 73 },
      { "nome": "Nuno Valente", "posicoes": ["DE"], "ovr": 82 },
      { "nome": "Mário Silva", "posicoes": ["DE"], "ovr": 75 },
      { "nome": "Costinha", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Maniche", "posicoes": ["MC"], "ovr": 86 },
      { "nome": "Deco", "posicoes": ["MC"], "ovr": 90 },
      { "nome": "Dmitri Alenichev", "posicoes": ["MC"], "ovr": 79 },
      { "nome": "Tiago", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Marco Ferreira", "posicoes": ["EXD"], "ovr": 74 },
      { "nome": "Capucho", "posicoes": ["EXD"], "ovr": 77 },
      { "nome": "César Peixoto", "posicoes": ["EXE", "DE"], "ovr": 76 },
      { "nome": "Clayton", "posicoes": ["EXE"], "ovr": 75 },
      { "nome": "Derlei", "posicoes": ["PL", "EXE"], "ovr": 86 },
      { "nome": "Hélder Postiga", "posicoes": ["PL"], "ovr": 80 },
      { "nome": "Edgaras Jankauskas", "posicoes": ["PL"], "ovr": 77 },
      { "nome": "Benni McCarthy", "posicoes": ["PL"], "ovr": 80 }
    ]
  },
  {
    "id": "por_2004",
    "nomeEquipa": "Porto 2004",
    "jogadores": [
      { "nome": "Vítor Baía", "posicoes": ["GR"], "ovr": 88 },
      { "nome": "Nuno", "posicoes": ["GR"], "ovr": 73 },
      { "nome": "Paulo Ferreira", "posicoes": ["DD"], "ovr": 87 },
      { "nome": "Ricardo Carvalho", "posicoes": ["DC"], "ovr": 90 },
      { "nome": "Jorge Costa", "posicoes": ["DC"], "ovr": 88 },
      { "nome": "Pedro Emanuel", "posicoes": ["DC"], "ovr": 79 },
      { "nome": "Ricardo Costa", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Nuno Valente", "posicoes": ["DE"], "ovr": 85 },
      { "nome": "Mário Silva", "posicoes": ["DE"], "ovr": 74 },
      { "nome": "Costinha", "posicoes": ["MC"], "ovr": 87 },
      { "nome": "Maniche", "posicoes": ["MC"], "ovr": 88 },
      { "nome": "Pedro Mendes", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Deco", "posicoes": ["MC"], "ovr": 93 },
      { "nome": "Dmitri Alenichev", "posicoes": ["MC"], "ovr": 84 },
      { "nome": "Carlos Alberto", "posicoes": ["MC", "EXD", "EXE"], "ovr": 81 },
      { "nome": "Ricardo Fernandes", "posicoes": ["MC"], "ovr": 72 },
      { "nome": "Marco Ferreira", "posicoes": ["EXD"], "ovr": 73 },
      { "nome": "Maciel", "posicoes": ["EXD", "EXE"], "ovr": 74 },
      { "nome": "César Peixoto", "posicoes": ["EXE"], "ovr": 75 },
      { "nome": "Benni McCarthy", "posicoes": ["PL"], "ovr": 87 },
      { "nome": "Derlei", "posicoes": ["PL", "EXE"], "ovr": 87 },
      { "nome": "Edgaras Jankauskas", "posicoes": ["PL"], "ovr": 76 },
      { "nome": "Bruno Moraes", "posicoes": ["PL"], "ovr": 71 }
    ]
  },
  {
    "id": "por_2009",
    "nomeEquipa": "Porto 2009",
    "jogadores": [
      { "nome": "Helton", "posicoes": ["GR"], "ovr": 83 },
      { "nome": "Nuno", "posicoes": ["GR"], "ovr": 72 },
      { "nome": "Jorge Fucile", "posicoes": ["DD", "DE"], "ovr": 80 },
      { "nome": "Cristian Săpunaru", "posicoes": ["DD"], "ovr": 76 },
      { "nome": "Bruno Alves", "posicoes": ["DC"], "ovr": 83 },
      { "nome": "Rolando", "posicoes": ["DC"], "ovr": 80 },
      { "nome": "Pedro Emanuel", "posicoes": ["DC"], "ovr": 74 },
      { "nome": "Milan Stepanov", "posicoes": ["DC"], "ovr": 73 },
      { "nome": "Aly Cissokho", "posicoes": ["DE"], "ovr": 82 },
      { "nome": "Lucho González", "posicoes": ["MC"], "ovr": 87 },
      { "nome": "Raul Meireles", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Fernando Reges", "posicoes": ["MC"], "ovr": 83 },
      { "nome": "Fredy Guarín", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Tomás Costa", "posicoes": ["MC", "DD"], "ovr": 74 },
      { "nome": "Andrés Madrid", "posicoes": ["MC"], "ovr": 71 },
      { "nome": "Lisandro López", "posicoes": ["PL", "EXD", "EXE"], "ovr": 86 },
      { "nome": "Cristian Rodríguez", "posicoes": ["EXE", "EXD"], "ovr": 82 },
      { "nome": "Hulk", "posicoes": ["EXD"], "ovr": 86 },
      { "nome": "Mariano González", "posicoes": ["EXD", "EXE"], "ovr": 75 },
      { "nome": "Tarik Sektioui", "posicoes": ["EXE"], "ovr": 74 },
      { "nome": "Candeias", "posicoes": ["EXD"], "ovr": 70 },
      { "nome": "Ernesto Farías", "posicoes": ["PL"], "ovr": 78 },
      { "nome": "Rabiola", "posicoes": ["PL"], "ovr": 69 }
    ]
  },
  {
    "id": "por_2111",
    "nomeEquipa": "Porto 2011",
    "jogadores": [
      { "nome": "Helton", "posicoes": ["GR"], "ovr": 83 },
      { "nome": "Beto", "posicoes": ["GR"], "ovr": 75 },
      { "nome": "Jorge Fucile", "posicoes": ["DD", "DE"], "ovr": 81 },
      { "nome": "Cristian Săpunaru", "posicoes": ["DD"], "ovr": 77 },
      { "nome": "Rolando", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Nicolas Otamendi", "posicoes": ["DC"], "ovr": 80 },
      { "nome": "Maicon", "posicoes": ["DC"], "ovr": 78 },
      { "nome": "Sereno", "posicoes": ["DC", "DD", "DE"], "ovr": 73 },
      { "nome": "Álvaro Pereira", "posicoes": ["DE"], "ovr": 83 },
      { "nome": "João Moutinho", "posicoes": ["MC"], "ovr": 87 },
      { "nome": "Fernando Reges", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Fredy Guarín", "posicoes": ["MC"], "ovr": 82 },
      { "nome": "Belluschi", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Ruben Micael", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Souza", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Hulk", "posicoes": ["EXD"], "ovr": 90 },
      { "nome": "Silvestre Varela", "posicoes": ["EXE", "EXD"], "ovr": 83 },
      { "nome": "James Rodríguez", "posicoes": ["EXE", "MC"], "ovr": 82 },
      { "nome": "Ukra", "posicoes": ["EXD"], "ovr": 72 },
      { "nome": "Christian Atsu", "posicoes": ["EXE"], "ovr": 71 },
      { "nome": "Radamel Falcao", "posicoes": ["PL"], "ovr": 91 },
      { "nome": "Walter", "posicoes": ["PL"], "ovr": 74 },
      { "nome": "Orlando Sá", "posicoes": ["PL"], "ovr": 71 }
    ]
  },
  {
    "id": "por_2018",
    "nomeEquipa": "Porto 2018",
    "jogadores": [
      { "nome": "Iker Casillas", "posicoes": ["GR"], "ovr": 85 },
      { "nome": "José Sá", "posicoes": ["GR"], "ovr": 80 },
      { "nome": "Ricardo Pereira", "posicoes": ["DD", "DE", "EXD"], "ovr": 85 },
      { "nome": "Maxi Pereira", "posicoes": ["DD"], "ovr": 76 },
      { "nome": "Felipe", "posicoes": ["DC"], "ovr": 85 },
      { "nome": "Iván Marcano", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Diego Reyes", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Yordan Osorio", "posicoes": ["DC"], "ovr": 72 },
      { "nome": "Alex Telles", "posicoes": ["DE"], "ovr": 84 },
      { "nome": "Danilo Pereira", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Héctor Herrera", "posicoes": ["MC"], "ovr": 84 },
      { "nome": "Óliver Torres", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Sérgio Oliveira", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Otávio", "posicoes": ["MC", "EXD", "EXE"], "ovr": 80 },
      { "nome": "André André", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Yacine Brahimi", "posicoes": ["EXE"], "ovr": 86 },
      { "nome": "Jesús Corona", "posicoes": ["EXD", "EXE", "DD"], "ovr": 83 },
      { "nome": "Hernâni", "posicoes": ["EXD"], "ovr": 74 },
      { "nome": "Vincent Aboubakar", "posicoes": ["PL"], "ovr": 83 },
      { "nome": "Moussa Marega", "posicoes": ["PL", "EXD"], "ovr": 82 },
      { "nome": "Tiquinho Soares", "posicoes": ["PL"], "ovr": 79 },
      { "nome": "Gonçalo Paciência", "posicoes": ["PL"], "ovr": 74 },
      { "nome": "Waris", "posicoes": ["PL"], "ovr": 73 }
    ]
  },
  {
    "id": "por_2022",
    "nomeEquipa": "Porto 2022",
    "jogadores": [
      { "nome": "Diogo Costa", "posicoes": ["GR"], "ovr": 83 },
      { "nome": "Agustín Marchesín", "posicoes": ["GR"], "ovr": 78 },
      { "nome": "João Mário", "posicoes": ["DD"], "ovr": 77 },
      { "nome": "Rodrigo Conceição", "posicoes": ["DD", "EXD"], "ovr": 69 },
      { "nome": "Pepe", "posicoes": ["DC"], "ovr": 86 },
      { "nome": "Chancel Mbemba", "posicoes": ["DC"], "ovr": 83 },
      { "nome": "Fábio Cardoso", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Wendell", "posicoes": ["DE"], "ovr": 75 },
      { "nome": "Zaidu Sanusi", "posicoes": ["DE"], "ovr": 74 },
      { "nome": "Vitinha", "posicoes": ["MC"], "ovr": 88 },
      { "nome": "Mateus Uribe", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Otávio", "posicoes": ["EXD", "EXE", "MC"], "ovr": 85 },
      { "nome": "Pepê", "posicoes": ["EXE", "EXD", "DD", "MC"], "ovr": 79 },
      { "nome": "Fábio Vieira", "posicoes": ["MC", "EXD", "EXE"], "ovr": 79 },
      { "nome": "Stephen Eustáquio", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Marko Grujić", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Bruno Costa", "posicoes": ["MC"], "ovr": 72 },
      { "nome": "Luis Díaz", "posicoes": ["EXE"], "ovr": 88 },
      { "nome": "Francisco Conceição", "posicoes": ["EXD"], "ovr": 73 },
      { "nome": "Mehdi Taremi", "posicoes": ["PL"], "ovr": 84 },
      { "nome": "Evanilson", "posicoes": ["PL"], "ovr": 80 },
      { "nome": "Toni Martínez", "posicoes": ["PL"], "ovr": 75 },
      { "nome": "Danny Loader", "posicoes": ["PL", "MC"], "ovr": 68 }
    ]
  },
  {
    "id": "por_2026",
    "nomeEquipa": "Porto 2026",
    "jogadores": [
      { "nome": "Diogo Costa", "posicoes": ["GR"], "ovr": 87 },
      { "nome": "Cláudio Ramos", "posicoes": ["GR"], "ovr": 77 },
      { "nome": "João Costa", "posicoes": ["GR"], "ovr": 75 },
      { "nome": "Martim Fernandes", "posicoes": ["DD", "DE"], "ovr": 82 },
      { "nome": "Alberto Costa", "posicoes": ["DD"], "ovr": 82 },
      { "nome": "Jakub Kiwior", "posicoes": ["DC", "DE"], "ovr": 85 },
      { "nome": "Jan Bednarek", "posicoes": ["DC"], "ovr": 85 },
      { "nome": "Thiago Silva", "posicoes": ["DC"], "ovr": 83 },
      { "nome": "Dominik Prpić", "posicoes": ["DC"], "ovr": 74 },
      { "nome": "Francisco Moura", "posicoes": ["DE"], "ovr": 75 },
      { "nome": "Zaidu Sanusi", "posicoes": ["DE"], "ovr": 75 },
      { "nome": "Alan Varela", "posicoes": ["MC"], "ovr": 83 },
      { "nome": "Pablo Rosario", "posicoes": ["MC", "DE", "DD", "DC"], "ovr": 81 },
      { "nome": "Victor Froholdt", "posicoes": ["MC"], "ovr": 86 },
      { "nome": "Gabri Veiga", "posicoes": ["MC", "EXE"], "ovr": 83 },
      { "nome": "Seko Fofana", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Oskar Pietuszewski", "posicoes": ["EXE"], "ovr": 80 },
      { "nome": "Rodrigo Mora", "posicoes": ["MC", "EXD", "EXE"], "ovr": 82 },
      { "nome": "Borja Sainz", "posicoes": ["EXE"], "ovr": 79 },
      { "nome": "Samu Omorodion", "posicoes": ["PL"], "ovr": 84 },
      { "nome": "Luuk de Jong", "posicoes": ["PL"], "ovr": 80 },
      { "nome": "Deniz Gül", "posicoes": ["PL"], "ovr": 75 },
      { "nome": "Terem Moffi", "posicoes": ["PL"], "ovr": 73 },
      { "nome": "Pepê", "posicoes": ["EXD", "EXE", "MC", "DD"], "ovr": 83 },
      { "nome": "William Gomes", "posicoes": ["EXD", "EXE"], "ovr": 82 }
    ]
  },
  {
    "id": "por_alltime",
    "nomeEquipa": "Porto All-Time",
    "jogadores": [
      { "nome": "Vítor Baía", "posicoes": ["GR"], "ovr": 89 },
      { "nome": "Helton", "posicoes": ["GR"], "ovr": 85 },
      { "nome": "João Pinto", "posicoes": ["DD"], "ovr": 86 },
      { "nome": "Paulo Ferreira", "posicoes": ["DD"], "ovr": 85 },
      { "nome": "Ricardo Carvalho", "posicoes": ["DC"], "ovr": 91 },
      { "nome": "Pepe", "posicoes": ["DC"], "ovr": 90 },
      { "nome": "Aloísio", "posicoes": ["DC"], "ovr": 85 },
      { "nome": "Jorge Costa", "posicoes": ["DC"], "ovr": 88 },
      { "nome": "Branco", "posicoes": ["DE"], "ovr": 85 },
      { "nome": "Alex Sandro", "posicoes": ["DE"], "ovr": 85 },
      { "nome": "Deco", "posicoes": ["MC"], "ovr": 92 },
      { "nome": "Lucho González", "posicoes": ["MC"], "ovr": 87 },
      { "nome": "Maniche", "posicoes": ["MC"], "ovr": 86 },
      { "nome": "Vitinha", "posicoes": ["MC"], "ovr": 86 },
      { "nome": "Costinha", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "James Rodriguez", "posicoes": ["MC", "EXE"], "ovr": 88 },
      { "nome": "Paulo Futre", "posicoes": ["EXE", "EXD"], "ovr": 91 },
      { "nome": "Rabah Madjer", "posicoes": ["EXD", "PL"], "ovr": 90 },
      { "nome": "Hulk", "posicoes": ["EXD"], "ovr": 90 },
      { "nome": "Luis Díaz", "posicoes": ["EXE"], "ovr": 88 },
      { "nome": "Radamel Falcao", "posicoes": ["PL"], "ovr": 91 },
      { "nome": "Mário Jardel", "posicoes": ["PL"], "ovr": 90 },
      { "nome": "Fernando Gomes", "posicoes": ["PL"], "ovr": 90 }
    ]
  },

// ==========================================
  // PARTE 2: SL BENFICA (11 EQUIPAS)
  // ==========================================
  {
    "id": "slb_1962",
    "nomeEquipa": "Benfica 1962",
    "jogadores": [
      { "nome": "Costa Pereira", "posicoes": ["GR"], "ovr": 86 },
      { "nome": "José de Melo", "posicoes": ["GR"], "ovr": 72 },
      { "nome": "Mario João", "posicoes": ["DD"], "ovr": 80 },
      { "nome": "Angelo Martins", "posicoes": ["DE"], "ovr": 82 },
      { "nome": "Germano", "posicoes": ["DC"], "ovr": 88 },
      { "nome": "Raul Machado", "posicoes": ["DC"], "ovr": 79 },
      { "nome": "Saraiva", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Fernando Cruz", "posicoes": ["DE", "DC"], "ovr": 81 },
      { "nome": "Mário Coluna", "posicoes": ["MC"], "ovr": 90 },
      { "nome": "José Neto", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Joaquim Santana", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Cavém", "posicoes": ["MC", "DE"], "ovr": 82 },
      { "nome": "Fernando Calado", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Inácio Esperança", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "António Simões", "posicoes": ["EXE"], "ovr": 86 },
      { "nome": "José Augusto", "posicoes": ["EXD"], "ovr": 85 },
      { "nome": "Mendes", "posicoes": ["EXD", "EXE"], "ovr": 72 },
      { "nome": "Eusébio", "posicoes": ["PL", "EXE", "EXD"], "ovr": 94 },
      { "nome": "José Águas", "posicoes": ["PL"], "ovr": 88 },
      { "nome": "José Augusto Torres", "posicoes": ["PL"], "ovr": 81 },
      { "nome": "Yaúca", "posicoes": ["PL"], "ovr": 75 },
      { "nome": "Pedras", "posicoes": ["PL"], "ovr": 73 }
    ]
  },
  {
    "id": "slb_1973",
    "nomeEquipa": "Benfica 1973",
    "jogadores": [
      { "nome": "José Henrique", "posicoes": ["GR"], "ovr": 82 },
      { "nome": "Bento", "posicoes": ["GR"], "ovr": 76 },
      { "nome": "Artur Correia", "posicoes": ["DD"], "ovr": 80 },
      { "nome": "Adolfo Calisto", "posicoes": ["DE"], "ovr": 81 },
      { "nome": "Humberto Coelho", "posicoes": ["DC"], "ovr": 86 },
      { "nome": "Messias Timula", "posicoes": ["DC"], "ovr": 81 },
      { "nome": "Malta da Silva", "posicoes": ["DC"], "ovr": 79 },
      { "nome": "Rui Rodrigues", "posicoes": ["DC"], "ovr": 78 },
      { "nome": "Toni", "posicoes": ["MC"], "ovr": 83 },
      { "nome": "Jaime Graça", "posicoes": ["MC"], "ovr": 82 },
      { "nome": "Vítor Martins", "posicoes": ["MC"], "ovr": 79 },
      { "nome": "Shéu Han", "posicoes": ["MC"], "ovr": 77 },
      { "nome": "Diamantino Costa", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Nelinho", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Vítor Paneira", "posicoes": ["MC"], "ovr": 72 },
      { "nome": "Nené", "posicoes": ["EXD", "PL"], "ovr": 85 },
      { "nome": "António Simões", "posicoes": ["EXE"], "ovr": 79 },
      { "nome": "Valdemar", "posicoes": ["EXE", "EXD"], "ovr": 73 },
      { "nome": "Adonias", "posicoes": ["EXD"], "ovr": 71 },
      { "nome": "Eusébio", "posicoes": ["PL"], "ovr": 90 },
      { "nome": "Rui Jordão", "posicoes": ["PL"], "ovr": 84 },
      { "nome": "Artur Jorge", "posicoes": ["PL"], "ovr": 82 },
      { "nome": "Vítor Baptista", "posicoes": ["PL"], "ovr": 80 }
    ]
  },
  {
    "id": "slb_1990",
    "nomeEquipa": "Benfica 1990",
    "jogadores": [
      { "nome": "Silvino Louro", "posicoes": ["GR"], "ovr": 81 },
      { "nome": "Manuel Bento", "posicoes": ["GR"], "ovr": 75 },
      { "nome": "José Carlos", "posicoes": ["DD"], "ovr": 76 },
      { "nome": "Abel Silva", "posicoes": ["DD"], "ovr": 74 },
      { "nome": "Aldair", "posicoes": ["DC"], "ovr": 86 },
      { "nome": "Ricardo Gomes", "posicoes": ["DC"], "ovr": 85 },
      { "nome": "Carlos Mozer", "posicoes": ["DC"], "ovr": 84 },
      { "nome": "Samuel Quina", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Paulo Madeira", "posicoes": ["DC"], "ovr": 73 },
      { "nome": "Abel Xavier", "posicoes": ["DC", "DD"], "ovr": 73 },
      { "nome": "António Veloso", "posicoes": ["DE", "DD"], "ovr": 82 },
      { "nome": "Fonseca", "posicoes": ["DE"], "ovr": 72 },
      { "nome": "Valdo", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Jonas Thern", "posicoes": ["MC"], "ovr": 83 },
      { "nome": "Diamantino Miranda", "posicoes": ["MC"], "ovr": 79 },
      { "nome": "Ademir Alcântara", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Vítor Paneira", "posicoes": ["EXD", "MC"], "ovr": 82 },
      { "nome": "Pacheco", "posicoes": ["EXE"], "ovr": 78 },
      { "nome": "Nandinho", "posicoes": ["EXD"], "ovr": 71 },
      { "nome": "Mats Magnusson", "posicoes": ["PL"], "ovr": 84 },
      { "nome": "Vata", "posicoes": ["PL"], "ovr": 80 },
      { "nome": "César Brito", "posicoes": ["PL"], "ovr": 77 },
      { "nome": "Lima", "posicoes": ["PL"], "ovr": 74 }
    ]
  },
  {
    "id": "slb_1994",
    "nomeEquipa": "Benfica 1994",
    "jogadores": [
      { "nome": "Neno", "posicoes": ["GR"], "ovr": 80 },
      { "nome": "Tomislav Ivković", "posicoes": ["GR"], "ovr": 76 },
      { "nome": "Abel Xavier", "posicoes": ["DD", "DC"], "ovr": 78 },
      { "nome": "António Veloso", "posicoes": ["DD"], "ovr": 77 },
      { "nome": "Hélder Cristóvão", "posicoes": ["DC"], "ovr": 81 },
      { "nome": "Carlos Mozer", "posicoes": ["DC"], "ovr": 80 },
      { "nome": "William", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Stefan Schwarz", "posicoes": ["DE", "MC"], "ovr": 83 },
      { "nome": "Abdelkrim El Hadrioui", "posicoes": ["DE"], "ovr": 76 },
      { "nome": "Abel Silva", "posicoes": ["DE"], "ovr": 71 },
      { "nome": "Rui Costa", "posicoes": ["MC"], "ovr": 84 },
      { "nome": "Isaías", "posicoes": ["MC", "PL"], "ovr": 83 },
      { "nome": "Aleksandr Mostovoi", "posicoes": ["MC"], "ovr": 77 },
      { "nome": "Nilsen", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Kula", "posicoes": ["MC"], "ovr": 71 },
      { "nome": "Vítor Paneira", "posicoes": ["EXD", "MC"], "ovr": 81 },
      { "nome": "Ailton", "posicoes": ["EXD", "EXE"], "ovr": 78 },
      { "nome": "António Pacheco", "posicoes": ["EXE"], "ovr": 75 },
      { "nome": "João Vieira Pinto", "posicoes": ["PL", "MC"], "ovr": 87 },
      { "nome": "Sergey Yuran", "posicoes": ["PL"], "ovr": 82 },
      { "nome": "Rui Águas", "posicoes": ["PL"], "ovr": 80 },
      { "nome": "César Brito", "posicoes": ["PL"], "ovr": 75 },
      { "nome": "Clóvis", "posicoes": ["PL"], "ovr": 72 }
    ]
  },
  {
    "id": "slb_2005",
    "nomeEquipa": "Benfica 2005",
    "jogadores": [
      { "nome": "Quim", "posicoes": ["GR"], "ovr": 79 },
      { "nome": "José Moreira", "posicoes": ["GR"], "ovr": 76 },
      { "nome": "Miguel Monteiro", "posicoes": ["DD", "EXD"], "ovr": 82 },
      { "nome": "Armando Sá", "posicoes": ["DD"], "ovr": 72 },
      { "nome": "Luisão", "posicoes": ["DC"], "ovr": 81 },
      { "nome": "Ricardo Rocha", "posicoes": ["DC"], "ovr": 78 },
      { "nome": "Argel Fucks", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Alcides", "posicoes": ["DC"], "ovr": 73 },
      { "nome": "Takis Fyssas", "posicoes": ["DE"], "ovr": 76 },
      { "nome": "Manuel dos Santos", "posicoes": ["DE"], "ovr": 74 },
      { "nome": "Petit", "posicoes": ["MC"], "ovr": 83 },
      { "nome": "Manuel Fernandes", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Nuno Assis", "posicoes": ["MC"], "ovr": 77 },
      { "nome": "Zlatko Zahovič", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Bruno Aguiar", "posicoes": ["MC"], "ovr": 72 },
      { "nome": "Paulo Almeida", "posicoes": ["MC"], "ovr": 70 },
      { "nome": "Simão Sabrosa", "posicoes": ["EXE"], "ovr": 85 },
      { "nome": "Geovanni", "posicoes": ["EXD"], "ovr": 80 },
      { "nome": "Carlitos", "posicoes": ["EXD", "EXE"], "ovr": 72 },
      { "nome": "Nuno Gomes", "posicoes": ["PL"], "ovr": 81 },
      { "nome": "Mantorras", "posicoes": ["PL"], "ovr": 76 },
      { "nome": "Azar Karadas", "posicoes": ["PL", "DC"], "ovr": 74 },
      { "nome": "Tommaso Rocchi", "posicoes": ["PL"], "ovr": 71 }
    ]
  },
  {
    "id": "slb_2010",
    "nomeEquipa": "Benfica 2010",
    "jogadores": [
      { "nome": "Quim", "posicoes": ["GR"], "ovr": 78 },
      { "nome": "Júlio César", "posicoes": ["GR"], "ovr": 73 },
      { "nome": "Maxi Pereira", "posicoes": ["DD"], "ovr": 82 },
      { "nome": "Luisão", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "David Luiz", "posicoes": ["DC"], "ovr": 84 },
      { "nome": "Sidnei", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Miguel Vítor", "posicoes": ["DC"], "ovr": 72 },
      { "nome": "Fábio Coentrão", "posicoes": ["DE", "EXE"], "ovr": 84 },
      { "nome": "César Peixoto", "posicoes": ["DE", "MC"], "ovr": 75 },
      { "nome": "Pablo Aimar", "posicoes": ["MC"], "ovr": 87 },
      { "nome": "Ramires", "posicoes": ["MC", "EXD"], "ovr": 86 },
      { "nome": "Javi García", "posicoes": ["MC"], "ovr": 83 },
      { "nome": "Carlos Martins", "posicoes": ["MC"], "ovr": 79 },
      { "nome": "Ruben Amorim", "posicoes": ["MC", "DD"], "ovr": 77 },
      { "nome": "Airton", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Felipe Menezes", "posicoes": ["MC"], "ovr": 71 },
      { "nome": "Ángel Di María", "posicoes": ["EXD", "EXE"], "ovr": 86 },
      { "nome": "Éder Luís", "posicoes": ["EXD", "PL"], "ovr": 74 },
      { "nome": "Jonathan Urretaviscaya", "posicoes": ["EXD"], "ovr": 73 },
      { "nome": "Óscar Cardozo", "posicoes": ["PL"], "ovr": 86 },
      { "nome": "Javier Saviola", "posicoes": ["PL", "MC"], "ovr": 83 },
      { "nome": "Nuno Gomes", "posicoes": ["PL"], "ovr": 76 },
      { "nome": "Weldon", "posicoes": ["PL"], "ovr": 73 }
    ]
  },
  {
    "id": "slb_2014",
    "nomeEquipa": "Benfica 2014",
    "jogadores": [
      { "nome": "Jan Oblak", "posicoes": ["GR"], "ovr": 87 },
      { "nome": "Artur Moraes", "posicoes": ["GR"], "ovr": 77 },
      { "nome": "Maxi Pereira", "posicoes": ["DD"], "ovr": 79 },
      { "nome": "André Almeida", "posicoes": ["DD", "DE", "MC"], "ovr": 75 },
      { "nome": "Ezequiel Garay", "posicoes": ["DC"], "ovr": 85 },
      { "nome": "Luisão", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Jardel", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Steven Vitória", "posicoes": ["DC"], "ovr": 71 },
      { "nome": "Guilherme Siqueira", "posicoes": ["DE"], "ovr": 83 },
      { "nome": "Nemanja Matić", "posicoes": ["MC"], "ovr": 86 },
      { "nome": "Enzo Pérez", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Ljubomir Fejsa", "posicoes": ["MC"], "ovr": 82 },
      { "nome": "André Gomes", "posicoes": ["MC"], "ovr": 77 },
      { "nome": "Ruben Amorim", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Filip Đuričić", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Nicolás Gaitán", "posicoes": ["EXE", "EXD"], "ovr": 86 },
      { "nome": "Eduardo Salvio", "posicoes": ["EXD"], "ovr": 84 },
      { "nome": "Lazar Marković", "posicoes": ["EXD", "PL"], "ovr": 81 },
      { "nome": "Miralem Sulejmani", "posicoes": ["EXE", "EXD"], "ovr": 77 },
      { "nome": "Ivan Cavaleiro", "posicoes": ["EXE", "EXD"], "ovr": 73 },
      { "nome": "Lima", "posicoes": ["PL"], "ovr": 84 },
      { "nome": "Rodrigo Moreno", "posicoes": ["PL", "EXD"], "ovr": 81 },
      { "nome": "Óscar Cardozo", "posicoes": ["PL"], "ovr": 83 }
    ]
  },
  {
    "id": "slb_2017",
    "nomeEquipa": "Benfica 2017",
    "jogadores": [
      { "nome": "Ederson", "posicoes": ["GR"], "ovr": 86 },
      { "nome": "Júlio César", "posicoes": ["GR"], "ovr": 77 },
      { "nome": "Nélson Semedo", "posicoes": ["DD"], "ovr": 82 },
      { "nome": "André Almeida", "posicoes": ["DD", "DE"], "ovr": 76 },
      { "nome": "Victor Lindelöf", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Jardel", "posicoes": ["DC"], "ovr": 78 },
      { "nome": "Luisão", "posicoes": ["DC"], "ovr": 77 },
      { "nome": "Lisandro López", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Alex Grimaldo", "posicoes": ["DE"], "ovr": 80 },
      { "nome": "Eliseu", "posicoes": ["DE"], "ovr": 75 },
      { "nome": "Pizzi", "posicoes": ["MC", "EXD"], "ovr": 85 },
      { "nome": "Ljubomir Fejsa", "posicoes": ["MC"], "ovr": 83 },
      { "nome": "Andreas Samaris", "posicoes": ["MC"], "ovr": 77 },
      { "nome": "Filipe Augusto", "posicoes": ["MC"], "ovr": 72 },
      { "nome": "Eduardo Salvio", "posicoes": ["EXD"], "ovr": 82 },
      { "nome": "Franco Cervi", "posicoes": ["EXE"], "ovr": 78 },
      { "nome": "Andrija Živković", "posicoes": ["EXD", "EXE"], "ovr": 76 },
      { "nome": "Rafa Silva", "posicoes": ["EXD", "EXE"], "ovr": 81 },
      { "nome": "André Carrillo", "posicoes": ["EXD", "EXE"], "ovr": 75 },
      { "nome": "Jonas", "posicoes": ["PL"], "ovr": 86 },
      { "nome": "Kostas Mitroglou", "posicoes": ["PL"], "ovr": 83 },
      { "nome": "Raúl Jiménez", "posicoes": ["PL"], "ovr": 79 },
      { "nome": "Luka Jović", "posicoes": ["PL"], "ovr": 70 }
    ]
  },
  {
    "id": "slb_2019",
    "nomeEquipa": "Benfica 2019",
    "jogadores": [
      { "nome": "Odisseas Vlachodimos", "posicoes": ["GR"], "ovr": 79 },
      { "nome": "Mile Svilar", "posicoes": ["GR"], "ovr": 70 },
      { "nome": "André Almeida", "posicoes": ["DD"], "ovr": 77 },
      { "nome": "Tyronne Ebuehi", "posicoes": ["DD"], "ovr": 71 },
      { "nome": "Rúben Dias", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Francisco Ferro", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Jardel", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Germán Conti", "posicoes": ["DC"], "ovr": 73 },
      { "nome": "Alex Grimaldo", "posicoes": ["DE"], "ovr": 83 },
      { "nome": "Yuri Ribeiro", "posicoes": ["DE"], "ovr": 72 },
      { "nome": "Pizzi", "posicoes": ["EXD", "MC"], "ovr": 85 },
      { "nome": "Gabriel Pires", "posicoes": ["MC"], "ovr": 79 },
      { "nome": "Ljubomir Fejsa", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Andreas Samaris", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Gedson Fernandes", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Rafa Silva", "posicoes": ["EXE", "EXD"], "ovr": 84 },
      { "nome": "Franco Cervi", "posicoes": ["EXE"], "ovr": 76 },
      { "nome": "Eduardo Salvio", "posicoes": ["EXD"], "ovr": 77 },
      { "nome": "Andrija Živković", "posicoes": ["EXD", "EXE"], "ovr": 74 },
      { "nome": "João Félix", "posicoes": ["PL", "MC"], "ovr": 84 },
      { "nome": "Haris Seferović", "posicoes": ["PL"], "ovr": 79 },
      { "nome": "Jonas", "posicoes": ["PL"], "ovr": 80 },
      { "nome": "Facundo Ferreyra", "posicoes": ["PL"], "ovr": 74 }
    ]
  },
  {
    "id": "slb_2023",
    "nomeEquipa": "Benfica 2023",
    "jogadores": [
      { "nome": "Odysseas Vlachodimos", "posicoes": ["GR"], "ovr": 81 },
      { "nome": "Samuel Soares", "posicoes": ["GR"], "ovr": 67 },
      { "nome": "Alexander Bah", "posicoes": ["DD"], "ovr": 78 },
      { "nome": "Gilberto", "posicoes": ["DD"], "ovr": 75 },
      { "nome": "Nicolás Otamendi", "posicoes": ["DC"], "ovr": 83 },
      { "nome": "António Silva", "posicoes": ["DC"], "ovr": 80 },
      { "nome": "Lucas Veríssimo", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Morato", "posicoes": ["DC"], "ovr": 74 },
      { "nome": "Alex Grimaldo", "posicoes": ["DE"], "ovr": 85 },
      { "nome": "Mihailo Ristić", "posicoes": ["DE"], "ovr": 73 },
      { "nome": "João Mário", "posicoes": ["EXE", "EXD", "MC"], "ovr": 84 },
      { "nome": "Fredrik Aursnes", "posicoes": ["MC", "DD", "DE", "EXE"], "ovr": 83 },
      { "nome": "Florentino Luís", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Enzo Fernández", "posicoes": ["MC"], "ovr": 87 },
      { "nome": "Chiquinho", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "João Neves", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Rafa Silva", "posicoes": ["EXD", "EXE", "MC"], "ovr": 83 },
      { "nome": "David Neres", "posicoes": ["EXD", "EXE"], "ovr": 83 },
      { "nome": "Julian Draxler", "posicoes": ["EXE"], "ovr": 76 },
      { "nome": "Diego Moreira", "posicoes": ["EXE"], "ovr": 66 },
      { "nome": "Gonçalo Ramos", "posicoes": ["PL"], "ovr": 84 },
      { "nome": "Petar Musa", "posicoes": ["PL"], "ovr": 74 },
      { "nome": "Henrique Araújo", "posicoes": ["PL"], "ovr": 70 }
    ]
  },
  {
    "id": "slb_alltime",
    "nomeEquipa": "Benfica All-Time",
    "jogadores": [
      { "nome": "Manuel Bento", "posicoes": ["GR"], "ovr": 89 },
      { "nome": "Costa Pereira", "posicoes": ["GR"], "ovr": 87 },
      { "nome": "Miguel Monteiro", "posicoes": ["DD"], "ovr": 85 },
      { "nome": "Maxi Pereira", "posicoes": ["DD"], "ovr": 82 },
      { "nome": "Humberto Coelho", "posicoes": ["DC"], "ovr": 89 },
      { "nome": "Carlos Mozer", "posicoes": ["DC"], "ovr": 88 },
      { "nome": "Luisão", "posicoes": ["DC"], "ovr": 87 },
      { "nome": "Ezequiel Garay", "posicoes": ["DC"], "ovr": 86 },
      { "nome": "Alex Grimaldo", "posicoes": ["DE"], "ovr": 85 },
      { "nome": "Fábio Coentrão", "posicoes": ["DE"], "ovr": 85 },
      { "nome": "Mário Coluna", "posicoes": ["MC"], "ovr": 92 },
      { "nome": "Rui Costa", "posicoes": ["MC"], "ovr": 91 },
      { "nome": "Pablo Aimar", "posicoes": ["MC"], "ovr": 89 },
      { "nome": "Petit", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Enzo Pérez", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Ángel Di María", "posicoes": ["EXD"], "ovr": 88 },
      { "nome": "Simão Sabrosa", "posicoes": ["EXE"], "ovr": 87 },
      { "nome": "Nicolás Gaitán", "posicoes": ["EXE", "EXD"], "ovr": 86 },
      { "nome": "Chalana", "posicoes": ["EXE"], "ovr": 89 },
      { "nome": "Eusébio", "posicoes": ["PL"], "ovr": 95 },
      { "nome": "Jonas", "posicoes": ["PL"], "ovr": 88 },
      { "nome": "Nené", "posicoes": ["PL", "EXD"], "ovr": 87 },
      { "nome": "Óscar Cardozo", "posicoes": ["PL"], "ovr": 88 }
    ]
  },

// ==========================================
  // PARTE 3: SPORTING CP (10 EQUIPAS)
  // ==========================================
  {
    "id": "scp_1947",
    "nomeEquipa": "Sporting 1947",
    "jogadores": [
      { "nome": "João Azevedo", "posicoes": ["GR"], "ovr": 85 },
      { "nome": "Dores", "posicoes": ["GR"], "ovr": 71 },
      { "nome": "Octávio Barrosa", "posicoes": ["DC"], "ovr": 83 },
      { "nome": "Manuel Marques", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Juvenal", "posicoes": ["DC", "DD"], "ovr": 80 },
      { "nome": "Cardoso", "posicoes": ["DC"], "ovr": 74 },
      { "nome": "Veríssimo", "posicoes": ["DE"], "ovr": 79 },
      { "nome": "Canário", "posicoes": ["MC"], "ovr": 81 },
      { "nome": "Feliciano", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Carlos Gomes", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Manecas", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Jesus Correia", "posicoes": ["EXD"], "ovr": 88 },
      { "nome": "Albano", "posicoes": ["EXE"], "ovr": 87 },
      { "nome": "José Travassos", "posicoes": ["MC", "EXD", "EXE"], "ovr": 90 },
      { "nome": "Manuel Vasques", "posicoes": ["MC", "PL"], "ovr": 89 },
      { "nome": "Fernando Peyroteo", "posicoes": ["PL"], "ovr": 94 },
      { "nome": "Pires", "posicoes": ["PL"], "ovr": 75 },
      { "nome": "Mário Wilson", "posicoes": ["DC", "PL"], "ovr": 74 },
      { "nome": "Sidónio", "posicoes": ["EXD"], "ovr": 72 }
    ]
  },
  {
    "id": "scp_1964",
    "nomeEquipa": "Sporting 1964",
    "jogadores": [
      { "nome": "Joaquim Carvalho", "posicoes": ["GR"], "ovr": 82 },
      { "nome": "Aníbal", "posicoes": ["GR"], "ovr": 70 },
      { "nome": "Pedro Gomes", "posicoes": ["DD"], "ovr": 80 },
      { "nome": "Hilário", "posicoes": ["DE"], "ovr": 84 },
      { "nome": "Alexandre Baptista", "posicoes": ["DC"], "ovr": 81 },
      { "nome": "José Carlos", "posicoes": ["DC", "MC"], "ovr": 82 },
      { "nome": "João Morais", "posicoes": ["DC", "MC", "DD"], "ovr": 81 },
      { "nome": "Fernando Mendes", "posicoes": ["MC"], "ovr": 83 },
      { "nome": "Géo Carvalho", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Osvaldo Silva", "posicoes": ["MC"], "ovr": 79 },
      { "nome": "Perides", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Hugo", "posicoes": ["EXD"], "ovr": 74 },
      { "nome": "Mário Lino", "posicoes": ["DD", "EXD"], "ovr": 75 },
      { "nome": "Augusto Martins", "posicoes": ["EXE"], "ovr": 73 },
      { "nome": "Mascarenhas", "posicoes": ["PL"], "ovr": 85 },
      { "nome": "Ernesto Figueiredo", "posicoes": ["PL"], "ovr": 82 },
      { "nome": "Louro", "posicoes": ["PL"], "ovr": 72 }
    ]
  },
  {
    "id": "scp_1974",
    "nomeEquipa": "Sporting 1974",
    "jogadores": [
      { "nome": "Vítor Damas", "posicoes": ["GR"], "ovr": 86 },
      { "nome": "Conha", "posicoes": ["GR"], "ovr": 71 },
      { "nome": "Carlos Alhinho", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Bastos", "posicoes": ["DC"], "ovr": 79 },
      { "nome": "Vítor Baltasar", "posicoes": ["DC"], "ovr": 77 },
      { "nome": "Manaca", "posicoes": ["DE"], "ovr": 78 },
      { "nome": "Da Costa", "posicoes": ["DD"], "ovr": 75 },
      { "nome": "Nélson Fernandes", "posicoes": ["MC"], "ovr": 81 },
      { "nome": "Vagner", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Dani", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Fraguito", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Marinho", "posicoes": ["EXD"], "ovr": 81 },
      { "nome": "Chico Faria", "posicoes": ["EXE"], "ovr": 79 },
      { "nome": "Dé", "posicoes": ["EXD", "PL"], "ovr": 77 },
      { "nome": "Yazalde", "posicoes": ["PL"], "ovr": 91 },
      { "nome": "Rui Jordão", "posicoes": ["PL"], "ovr": 83 },
      { "nome": "Nélson", "posicoes": ["PL"], "ovr": 74 }
    ]
  },
  {
    "id": "scp_1982",
    "nomeEquipa": "Sporting 1982",
    "jogadores": [
      { "nome": "Ferenc Mészáros", "posicoes": ["GR"], "ovr": 82 },
      { "nome": "Vítor Damas", "posicoes": ["GR"], "ovr": 80 },
      { "nome": "Gabriel Mendes", "posicoes": ["DD"], "ovr": 78 },
      { "nome": "Augusto Inácio", "posicoes": ["DE"], "ovr": 80 },
      { "nome": "Zezinho", "posicoes": ["DE"], "ovr": 72 },
      { "nome": "Eurico Gomes", "posicoes": ["DC"], "ovr": 83 },
      { "nome": "Virgílio", "posicoes": ["DC"], "ovr": 77 },
      { "nome": "Dušan Maravić", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Lito", "posicoes": ["MC"], "ovr": 79 },
      { "nome": "Ademar Marques", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "António Oliveira", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Carlos Freire", "posicoes": ["MC", "EXD"], "ovr": 76 },
      { "nome": "Barão", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Nogueira", "posicoes": ["MC"], "ovr": 71 },
      { "nome": "Manuel Fernandes", "posicoes": ["PL"], "ovr": 86 },
      { "nome": "Rui Jordão", "posicoes": ["PL"], "ovr": 86 },
      { "nome": "António Nogueira", "posicoes": ["EXE"], "ovr": 74 },
      { "nome": "Paulo Meneses", "posicoes": ["EXD"], "ovr": 73 }
    ]
  },
  {
    "id": "scp_2000",
    "nomeEquipa": "Sporting 2000",
    "jogadores": [
      { "nome": "Peter Schmeichel", "posicoes": ["GR"], "ovr": 86 },
      { "nome": "Nelson", "posicoes": ["GR"], "ovr": 75 },
      { "nome": "César Prates", "posicoes": ["DD"], "ovr": 79 },
      { "nome": "Saber", "posicoes": ["DD"], "ovr": 73 },
      { "nome": "Beto", "posicoes": ["DC"], "ovr": 80 },
      { "nome": "André Cruz", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Quiroga", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Rui Jorge", "posicoes": ["DE"], "ovr": 79 },
      { "nome": "Vinícius", "posicoes": ["DE"], "ovr": 71 },
      { "nome": "Vidigal", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Duscher", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Pedro Barbosa", "posicoes": ["MC", "EXD", "EXE"], "ovr": 81 },
      { "nome": "Bino", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Toñito", "posicoes": ["MC", "EXD"], "ovr": 75 },
      { "nome": "Delfim", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Edmilson", "posicoes": ["EXD"], "ovr": 77 },
      { "nome": "Mpenza", "posicoes": ["EXE", "PL"], "ovr": 78 },
      { "nome": "De Franceschi", "posicoes": ["EXE"], "ovr": 75 },
      { "nome": "Alberto Acosta", "posicoes": ["PL"], "ovr": 83 },
      { "nome": "Ivaylo Iordanov", "posicoes": ["PL", "MC", "DC"], "ovr": 77 },
      { "nome": "Kwame Ayew", "posicoes": ["PL"], "ovr": 74 },
      { "nome": "Ouattara", "posicoes": ["PL"], "ovr": 72 }
    ]
  },
  {
    "id": "scp_2002",
    "nomeEquipa": "Sporting 2002",
    "jogadores": [
      { "nome": "Tiago", "posicoes": ["GR"], "ovr": 77 },
      { "nome": "Nelson", "posicoes": ["GR"], "ovr": 75 },
      { "nome": "César Prates", "posicoes": ["DD"], "ovr": 78 },
      { "nome": "Beto", "posicoes": ["DC"], "ovr": 81 },
      { "nome": "André Cruz", "posicoes": ["DC"], "ovr": 80 },
      { "nome": "Phil Babb", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Hugo", "posicoes": ["DC"], "ovr": 73 },
      { "nome": "Rui Jorge", "posicoes": ["DE"], "ovr": 79 },
      { "nome": "Dimas", "posicoes": ["DE"], "ovr": 74 },
      { "nome": "Paulo Bento", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Rui Bento", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Hugo Viana", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Pedro Barbosa", "posicoes": ["MC", "EXE"], "ovr": 80 },
      { "nome": "Horvath", "posicoes": ["MC"], "ovr": 72 },
      { "nome": "Ricardo Quaresma", "posicoes": ["EXD"], "ovr": 77 },
      { "nome": "Sá Pinto", "posicoes": ["EXD", "PL"], "ovr": 79 },
      { "nome": "Rodrigo Tello", "posicoes": ["EXE", "DE"], "ovr": 74 },
      { "nome": "Marius Niculae", "posicoes": ["PL"], "ovr": 79 },
      { "nome": "Jardel", "posicoes": ["PL"], "ovr": 89 },
      { "nome": "João Vieira Pinto", "posicoes": ["PL", "MC"], "ovr": 85 },
      { "nome": "Vitali Kutuzov", "posicoes": ["PL"], "ovr": 73 },
      { "nome": "Lourenço", "posicoes": ["PL"], "ovr": 71 }
    ]
  },
  {
    "id": "scp_2021",
    "nomeEquipa": "Sporting 2021",
    "jogadores": [
      { "nome": "Antonio Adán", "posicoes": ["GR"], "ovr": 81 },
      { "nome": "Luís Maximiano", "posicoes": ["GR"], "ovr": 74 },
      { "nome": "Pedro Porro", "posicoes": ["DD", "EXD"], "ovr": 80 },
      { "nome": "Sebastián Coates", "posicoes": ["DC"], "ovr": 81 },
      { "nome": "Gonçalo Inácio", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Zouhair Feddal", "posicoes": ["DC"], "ovr": 77 },
      { "nome": "Luís Neto", "posicoes": ["DC"], "ovr": 74 },
      { "nome": "Eduardo Quaresma", "posicoes": ["DC"], "ovr": 70 },
      { "nome": "Nuno Mendes", "posicoes": ["DE", "EXE"], "ovr": 81 },
      { "nome": "Matheus Reis", "posicoes": ["DE", "DC"], "ovr": 74 },
      { "nome": "João Palhinha", "posicoes": ["MC"], "ovr": 82 },
      { "nome": "Matheus Nunes", "posicoes": ["MC"], "ovr": 77 },
      { "nome": "João Mário", "posicoes": ["MC"], "ovr": 79 },
      { "nome": "Daniel Bragança", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Pedro Gonçalves", "posicoes": ["EXD", "EXE", "MC"], "ovr": 81 },
      { "nome": "Nuno Santos", "posicoes": ["EXE", "DE"], "ovr": 77 },
      { "nome": "Jovane Cabral", "posicoes": ["EXE", "EXD"], "ovr": 75 },
      { "nome": "Tabata", "posicoes": ["EXD", "MC"], "ovr": 74 },
      { "nome": "Tiago Tomás", "posicoes": ["PL"], "ovr": 72 },
      { "nome": "Paulinho", "posicoes": ["PL"], "ovr": 78 },
      { "nome": "Sporar", "posicoes": ["PL"], "ovr": 73 }
    ]
  },
  {
    "id": "scp_2024",
    "nomeEquipa": "Sporting 2024",
    "jogadores": [
      { "nome": "Franco Israel", "posicoes": ["GR"], "ovr": 75 },
      { "nome": "Antonio Adán", "posicoes": ["GR"], "ovr": 76 },
      { "nome": "Geny Catamo", "posicoes": ["DD", "EXD"], "ovr": 76 },
      { "nome": "Ricardo Esgaio", "posicoes": ["DD"], "ovr": 74 },
      { "nome": "Sebastián Coates", "posicoes": ["DC"], "ovr": 79 },
      { "nome": "Gonçalo Inácio", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Ousmane Diomande", "posicoes": ["DC"], "ovr": 83 },
      { "nome": "Eduardo Quaresma", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Jeremiah St. Juste", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Matheus Reis", "posicoes": ["DE", "DC"], "ovr": 75 },
      { "nome": "Morten Hjulmand", "posicoes": ["MC"], "ovr": 86 },
      { "nome": "Hidemasa Morita", "posicoes": ["MC"], "ovr": 79 },
      { "nome": "Daniel Bragança", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Pedro Gonçalves", "posicoes": ["EXE", "MC", "EXD"], "ovr": 82 },
      { "nome": "Nuno Santos", "posicoes": ["DE", "EXE"], "ovr": 78 },
      { "nome": "Marcus Edwards", "posicoes": ["EXD"], "ovr": 78 },
      { "nome": "Trincão", "posicoes": ["EXD", "EXE"], "ovr": 82 },
      { "nome": "Viktor Gyökeres", "posicoes": ["PL"], "ovr": 88 },
      { "nome": "Paulinho", "posicoes": ["PL"], "ovr": 77 },
    ]
  },
  {
    "id": "scp_2025",
    "nomeEquipa": "Sporting 2025",
    "jogadores": [
      { "nome": "Vladan Kovačević", "posicoes": ["GR"], "ovr": 77 },
      { "nome": "Franco Israel", "posicoes": ["GR"], "ovr": 77 },
      { "nome": "Geovany Quenda", "posicoes": ["EXD", "DD"], "ovr": 78 },
      { "nome": "Geny Catamo", "posicoes": ["DD", "DE", "EXD"], "ovr": 77 },
      { "nome": "Gonçalo Inácio", "posicoes": ["DC"], "ovr": 83 },
      { "nome": "Ousmane Diomande", "posicoes": ["DC"], "ovr": 84 },
      { "nome": "Zeno Debast", "posicoes": ["DC"], "ovr": 78 },
      { "nome": "Eduardo Quaresma", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Matheus Reis", "posicoes": ["DE", "DC"], "ovr": 75 },
      { "nome": "Maxi Araújo", "posicoes": ["DE", "EXE"], "ovr": 84 },
      { "nome": "Morten Hjulmand", "posicoes": ["MC"], "ovr": 86 },
      { "nome": "Hidemasa Morita", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Daniel Bragança", "posicoes": ["MC"], "ovr": 79 },
      { "nome": "Pedro Gonçalves", "posicoes": ["EXE", "MC", "EXD"], "ovr": 83 },
      { "nome": "Trincão", "posicoes": ["EXD", "EXE"], "ovr": 85 },
      { "nome": "Nuno Santos", "posicoes": ["DE", "EXE"], "ovr": 78 },
      { "nome": "Harder", "posicoes": ["PL"], "ovr": 76 },
      { "nome": "Viktor Gyökeres", "posicoes": ["PL"], "ovr": 90 }
    ]
  },
  {
    "id": "scp_alltime",
    "nomeEquipa": "Sporting All-Time",
    "jogadores": [
      { "nome": "Vítor Damas", "posicoes": ["GR"], "ovr": 88 },
      { "nome": "Peter Schmeichel", "posicoes": ["GR"], "ovr": 86 },
      { "nome": "Pedro Porro", "posicoes": ["DD"], "ovr": 84 },
      { "nome": "Hilário", "posicoes": ["DE"], "ovr": 85 },
      { "nome": "Sebastián Coates", "posicoes": ["DC"], "ovr": 85 },
      { "nome": "André Cruz", "posicoes": ["DC"], "ovr": 84 },
      { "nome": "Eurico Gomes", "posicoes": ["DC"], "ovr": 83 },
      { "nome": "Gonçalo Inácio", "posicoes": ["DC"], "ovr": 83 },
      { "nome": "Nuno Mendes", "posicoes": ["DE"], "ovr": 84 },
      { "nome": "João Palhinha", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Morten Hjulmand", "posicoes": ["MC"], "ovr": 84 },
      { "nome": "António Oliveira", "posicoes": ["MC"], "ovr": 86 },
      { "nome": "Pedro Gonçalves", "posicoes": ["MC", "EXE", "EXD"], "ovr": 84 },
      { "nome": "José Travassos", "posicoes": ["MC"], "ovr": 90 },
      { "nome": "Manuel Vasques", "posicoes": ["MC"], "ovr": 89 },
      { "nome": "Luís Figo", "posicoes": ["EXD"], "ovr": 90 },
      { "nome": "Cristiano Ronaldo", "posicoes": ["EXD", "EXE"], "ovr": 88 },
      { "nome": "Ricardo Quaresma", "posicoes": ["EXD"], "ovr": 83 },
      { "nome": "Paulo Futre", "posicoes": ["EXE"], "ovr": 86 },
      { "nome": "Fernando Peyroteo", "posicoes": ["PL"], "ovr": 94 },
      { "nome": "Yazalde", "posicoes": ["PL"], "ovr": 91 },
      { "nome": "Jardel", "posicoes": ["PL"], "ovr": 89 },
      { "nome": "Viktor Gyökeres", "posicoes": ["PL"], "ovr": 90 },
      { "nome": "Manuel Fernandes", "posicoes": ["PL"], "ovr": 86 },
      { "nome": "João Vieira Pinto", "posicoes": ["PL", "MC"], "ovr": 85 }
    ]
  },
// ==========================================
  // PARTE 4: OUTROS CAMPEÕES, BRAGA E VITÓRIA (8 EQUIPAS)
  // ==========================================
  {
    "id": "bel_1946",
    "nomeEquipa": "Belenenses 1946",
    "jogadores": [
      { "nome": "José Capela", "posicoes": ["GR"], "ovr": 82 },
      { "nome": "Feliciano", "posicoes": ["DC"], "ovr": 81 },
      { "nome": "Serafim Neves", "posicoes": ["DC"], "ovr": 78 },
      { "nome": "Vasco", "posicoes": ["DD"], "ovr": 76 },
      { "nome": "Mariano Amaro", "posicoes": ["MC"], "ovr": 84 },
      { "nome": "Feliciano Loureiro", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Gomes", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Mário Gomes", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Artur Quaresma", "posicoes": ["EXD"], "ovr": 84 },
      { "nome": "José Pedro", "posicoes": ["EXE"], "ovr": 81 },
      { "nome": "Rafael Correia", "posicoes": ["PL", "MC"], "ovr": 85 },
      { "nome": "Manuel Andrade", "posicoes": ["PL"], "ovr": 83 },
      { "nome": "Teixeira", "posicoes": ["PL"], "ovr": 75 }
    ]
  },
  {
    "id": "boa_2001",
    "nomeEquipa": "Boavista 2001",
    "jogadores": [
      { "nome": "Ricardo", "posicoes": ["GR"], "ovr": 82 },
      { "nome": "William Andem", "posicoes": ["GR"], "ovr": 75 },
      { "nome": "Rui Óscar", "posicoes": ["DD"], "ovr": 76 },
      { "nome": "Frechaut", "posicoes": ["DD", "MC"], "ovr": 77 },
      { "nome": "Litos", "posicoes": ["DC"], "ovr": 81 },
      { "nome": "Pedro Emanuel", "posicoes": ["DC"], "ovr": 80 },
      { "nome": "Paulo Turra", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Marisa", "posicoes": ["DC"], "ovr": 72 },
      { "nome": "Erivan", "posicoes": ["DE"], "ovr": 75 },
      { "nome": "Quevedo", "posicoes": ["DE"], "ovr": 74 },
      { "nome": "Petit", "posicoes": ["MC"], "ovr": 82 },
      { "nome": "Erwin Sánchez", "posicoes": ["MC"], "ovr": 81 },
      { "nome": "Rui Bento", "posicoes": ["MC", "DC"], "ovr": 77 },
      { "nome": "Jorge Silva", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Gouveia", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Martelinho", "posicoes": ["EXD"], "ovr": 78 },
      { "nome": "Duda", "posicoes": ["EXE"], "ovr": 79 },
      { "nome": "Whelliton", "posicoes": ["EXD", "PL"], "ovr": 75 },
      { "nome": "Pedro Santos", "posicoes": ["EXE"], "ovr": 72 },
      { "nome": "Elpídio Silva", "posicoes": ["PL"], "ovr": 82 },
      { "nome": "Demétrios", "posicoes": ["PL"], "ovr": 74 },
      { "nome": "Serginho", "posicoes": ["PL"], "ovr": 71 }
    ]
  },
  {
    "id": "scb_2010",
    "nomeEquipa": "Braga 2010",
    "jogadores": [
      { "nome": "Eduardo", "posicoes": ["GR"], "ovr": 80 },
      { "nome": "Pawel Kieszek", "posicoes": ["GR"], "ovr": 72 },
      { "nome": "João Pereira", "posicoes": ["DD"], "ovr": 79 },
      { "nome": "Filipe Oliveira", "posicoes": ["DD", "EXD"], "ovr": 73 },
      { "nome": "Moisés", "posicoes": ["DC"], "ovr": 78 },
      { "nome": "Alberto Rodríguez", "posicoes": ["DC"], "ovr": 79 },
      { "nome": "Aníbal Zurdo", "posicoes": ["DC"], "ovr": 71 },
      { "nome": "Evaldo", "posicoes": ["DE"], "ovr": 77 },
      { "nome": "Vandinho", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Hugo Viana", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Márcio Mossoró", "posicoes": ["MC"], "ovr": 79 },
      { "nome": "Luis Aguiar", "posicoes": ["MC"], "ovr": 77 },
      { "nome": "Madrid", "posicoes": ["MC"], "ovr": 72 },
      { "nome": "Alan", "posicoes": ["EXD"], "ovr": 80 },
      { "nome": "Paulo César", "posicoes": ["EXE", "EXD"], "ovr": 76 },
      { "nome": "Osvaldo Osvaldo", "posicoes": ["EXE"], "ovr": 71 },
      { "nome": "Albert Meyong", "posicoes": ["PL"], "ovr": 77 },
      { "nome": "Matheus", "posicoes": ["PL", "EXE", "EXD"], "ovr": 80 },
      { "nome": "Rentería", "posicoes": ["PL"], "ovr": 75 },
      { "nome": "Elton", "posicoes": ["PL"], "ovr": 72 }
    ]
  },
  {
    "id": "scb_2011",
    "nomeEquipa": "Braga 2011",
    "jogadores": [
      { "nome": "Artur Moraes", "posicoes": ["GR"], "ovr": 80 },
      { "nome": "Marcos", "posicoes": ["GR"], "ovr": 73 },
      { "nome": "Miguel Garcia", "posicoes": ["DD"], "ovr": 75 },
      { "nome": "Paulão", "posicoes": ["DC"], "ovr": 77 },
      { "nome": "Alberto Rodríguez", "posicoes": ["DC"], "ovr": 78 },
      { "nome": "Kaká", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Aníbal Capela", "posicoes": ["DC"], "ovr": 70 },
      { "nome": "Elderson Echiéjilé", "posicoes": ["DE"], "ovr": 76 },
      { "nome": "Sílvio", "posicoes": ["DE", "DD"], "ovr": 78 },
      { "nome": "Vandinho", "posicoes": ["MC"], "ovr": 77 },
      { "nome": "Hugo Viana", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Leandro Salino", "posicoes": ["MC", "DD"], "ovr": 76 },
      { "nome": "Márcio Mossoró", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Custódio", "posicoes": ["MC"], "ovr": 77 },
      { "nome": "Alan", "posicoes": ["EXD"], "ovr": 81 },
      { "nome": "Paulo César", "posicoes": ["EXE"], "ovr": 76 },
      { "nome": "Hélder Barbosa", "posicoes": ["EXE"], "ovr": 75 },
      { "nome": "Ukra", "posicoes": ["EXD"], "ovr": 73 },
      { "nome": "Albert Meyong", "posicoes": ["PL"], "ovr": 76 },
      { "nome": "Lima", "posicoes": ["PL"], "ovr": 80 },
      { "nome": "Nuno Gomes", "posicoes": ["PL"], "ovr": 75 }
    ]
  },
  {
    "id": "scb_2023",
    "nomeEquipa": "Braga 2023",
    "jogadores": [
      { "nome": "Matheus", "posicoes": ["GR"], "ovr": 79 },
      { "nome": "Tiago Sá", "posicoes": ["GR"], "ovr": 71 },
      { "nome": "Víctor Gómez", "posicoes": ["DD"], "ovr": 76 },
      { "nome": "Joe Mendes", "posicoes": ["DD"], "ovr": 72 },
      { "nome": "Tormena", "posicoes": ["DC"], "ovr": 77 },
      { "nome": "Sikou Niakaté", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Paulo Oliveira", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Nuno Sequeira", "posicoes": ["DE"], "ovr": 75 },
      { "nome": "Cristian Borja", "posicoes": ["DE"], "ovr": 73 },
      { "nome": "Al Musrati", "posicoes": ["MC"], "ovr": 81 },
      { "nome": "André Horta", "posicoes": ["MC"], "ovr": 77 },
      { "nome": "Uroš Račić", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Castro", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Pizzi", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Ricardo Horta", "posicoes": ["EXD", "EXE", "MC"], "ovr": 82 },
      { "nome": "Iuri Medeiros", "posicoes": ["EXD"], "ovr": 77 },
      { "nome": "Bruma", "posicoes": ["EXE", "EXD"], "ovr": 78 },
      { "nome": "Álvaro Djaló", "posicoes": ["EXE", "EXD"], "ovr": 75 },
      { "nome": "Simon Banza", "posicoes": ["PL"], "ovr": 78 },
      { "nome": "Abel Ruiz", "posicoes": ["PL"], "ovr": 76 },
      { "nome": "Rodrigo Gomes", "posicoes": ["EXD", "DD"], "ovr": 70 }
    ]
  },
  {
    "id": "vsc_1988",
    "nomeEquipa": "Vitória SC 1988",
    "jogadores": [
      { "nome": "Jesus", "posicoes": ["GR"], "ovr": 79 },
      { "nome": "Neno", "posicoes": ["GR"], "ovr": 74 },
      { "nome": "Costeado", "posicoes": ["DD"], "ovr": 76 },
      { "nome": "Miguel", "posicoes": ["DC"], "ovr": 77 },
      { "nome": "Bené", "posicoes": ["DC"], "ovr": 78 },
      { "nome": "Toni", "posicoes": ["DC"], "ovr": 74 },
      { "nome": "Nascimento", "posicoes": ["DE"], "ovr": 77 },
      { "nome": "N'Kama", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Ademir", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Soeiro", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Carvalhal", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Roldão", "posicoes": ["EXD"], "ovr": 75 },
      { "nome": "Tueba", "posicoes": ["EXE"], "ovr": 79 },
      { "nome": "Caio Júnior", "posicoes": ["EXD", "PL"], "ovr": 78 },
      { "nome": "Cascavel", "posicoes": ["PL"], "ovr": 83 },
      { "nome": "Chiquinho Conde", "posicoes": ["PL"], "ovr": 77 },
      { "nome": "Adão", "posicoes": ["PL"], "ovr": 72 }
    ]
  },
  {
    "id": "vsc_2013",
    "nomeEquipa": "Vitória SC 2013",
    "jogadores": [
      { "nome": "Douglas Jesus", "posicoes": ["GR"], "ovr": 77 },
      { "nome": "Assis", "posicoes": ["GR"], "ovr": 69 },
      { "nome": "Ricardo Pereira", "posicoes": ["DD", "EXD", "DE"], "ovr": 78 },
      { "nome": "Alex", "posicoes": ["DD"], "ovr": 74 },
      { "nome": "Paulo Oliveira", "posicoes": ["DC"], "ovr": 77 },
      { "nome": "N'Diaye", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Defendi", "posicoes": ["DC"], "ovr": 73 },
      { "nome": "Addy", "posicoes": ["DE"], "ovr": 72 },
      { "nome": "Leonel Olímpio", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "André André", "posicoes": ["MC"], "ovr": 77 },
      { "nome": "Tiago Rodrigues", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Barrientos", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Crivellaro", "posicoes": ["MC"], "ovr": 72 },
      { "nome": "Marco Matias", "posicoes": ["EXD", "EXE"], "ovr": 74 },
      { "nome": "Tomané", "posicoes": ["EXD", "PL"], "ovr": 73 },
      { "nome": "Soudani", "posicoes": ["EXE", "PL"], "ovr": 79 },
      { "nome": "Baldé", "posicoes": ["PL"], "ovr": 75 },
      { "nome": "Rabiola", "posicoes": ["PL"], "ovr": 71 }
    ]
  },
  {
    "id": "vsc_2017",
    "nomeEquipa": "Vitória SC 2017",
    "jogadores": [
      { "nome": "Miguel Silva", "posicoes": ["GR"], "ovr": 75 },
      { "nome": "Douglas Jesus", "posicoes": ["GR"], "ovr": 74 },
      { "nome": "Bruno Gaspar", "posicoes": ["DD"], "ovr": 76 },
      { "nome": "Sacko", "posicoes": ["DD"], "ovr": 71 },
      { "nome": "Josué Sá", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Pedro Henrique", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Moreno", "posicoes": ["DC", "MC"], "ovr": 73 },
      { "nome": "Konan", "posicoes": ["DE"], "ovr": 75 },
      { "nome": "Rafael Miranda", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Guillermo Celis", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "André André", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Hurtado", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Tozé", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Raphinha", "posicoes": ["EXD", "EXE"], "ovr": 80 },
      { "nome": "Hernâni", "posicoes": ["EXD"], "ovr": 75 },
      { "nome": "Sturgeon", "posicoes": ["EXE"], "ovr": 73 },
      { "nome": "Moussa Marega", "posicoes": ["PL", "EXD"], "ovr": 78 },
      { "nome": "Tiquinho Soares", "posicoes": ["PL"], "ovr": 77 },
      { "nome": "Texixeira", "posicoes": ["PL"], "ovr": 71 }
    ]
  },
// ==========================================
  // PARTE 5: SENSAÇÕES, FAVAS E HERÓIS DAS TAÇAS (13 EQUIPAS)
  // ==========================================
  {
    "id": "bel_1989",
    "nomeEquipa": "Belenenses 1989",
    "jogadores": [
      { "nome": "Fransergio", "posicoes": ["GR"], "ovr": 75 },
      { "nome": "Teixeira", "posicoes": ["DD"], "ovr": 73 },
      { "nome": "Sobrinho", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Jose Antonio", "posicoes": ["DC"], "ovr": 77 },
      { "nome": "Rui Gregório", "posicoes": ["DE"], "ovr": 74 },
      { "nome": "Macieirinha", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Jaime Mercês", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Juanico", "posicoes": ["MC"], "ovr": 77 },
      { "nome": "Adão", "posicoes": ["EXD"], "ovr": 74 },
      { "nome": "Chico Faria", "posicoes": ["EXE"], "ovr": 78 },
      { "nome": "Chiquinho Conde", "posicoes": ["PL"], "ovr": 77 },
      { "nome": "Mário Jorge", "posicoes": ["PL"], "ovr": 73 }
    ]
  },
  {
    "id": "bel_2007",
    "nomeEquipa": "Belenenses 2007",
    "jogadores": [
      { "nome": "Marco Aurélio", "posicoes": ["GR"], "ovr": 74 },
      { "nome": "Cândido Costa", "posicoes": ["DD", "EXD"], "ovr": 75 },
      { "nome": "Amaral", "posicoes": ["DD"], "ovr": 71 },
      { "nome": "Rolando", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Rodrigo Alvim", "posicoes": ["DE"], "ovr": 73 },
      { "nome": "Ruben Amorim", "posicoes": ["MC", "DD"], "ovr": 75 },
      { "nome": "Sandro Gaúcho", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Silas", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "José Pedro", "posicoes": ["MC", "EXE"], "ovr": 76 },
      { "nome": "Carlitos", "posicoes": ["EXD"], "ovr": 73 },
      { "nome": "Dady", "posicoes": ["PL"], "ovr": 77 },
      { "nome": "Fernando Varela", "posicoes": ["DC"], "ovr": 70 }
    ]
  },
  {
    "id": "cfb_1990",
    "nomeEquipa": "Estrela Amadora 1990",
    "jogadores": [
      { "nome": "Joaquim Melo", "posicoes": ["GR"], "ovr": 74 },
      { "nome": "Rui Neves", "posicoes": ["DD"], "ovr": 72 },
      { "nome": "Duilio", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Pedro Barny", "posicoes": ["DC", "DE"], "ovr": 75 },
      { "nome": "Chico Oliveira", "posicoes": ["DE"], "ovr": 71 },
      { "nome": "Basaúla", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Paulo Bento", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Bobó", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Nelo", "posicoes": ["EXE", "DE"], "ovr": 73 },
      { "nome": "Baroti", "posicoes": ["EXD"], "ovr": 72 },
      { "nome": "Ricardo Lopes", "posicoes": ["PL"], "ovr": 76 },
      { "nome": "Nelito", "posicoes": ["PL"], "ovr": 73 }
    ]
  },
  {
    "id": "sal_1991",
    "nomeEquipa": "Salgueiros 1991",
    "jogadores": [
      { "nome": "Bizarro", "posicoes": ["GR"], "ovr": 75 },
      { "nome": "Mário Reis", "posicoes": ["DD"], "ovr": 72 },
      { "nome": "Luis Miguel", "posicoes": ["DC"], "ovr": 74 },
      { "nome": "Carlos Manuel", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Sitoe", "posicoes": ["DE"], "ovr": 71 },
      { "nome": "Pedrosa", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Jorginho", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Toni", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Abílio", "posicoes": ["EXE", "MC"], "ovr": 76 },
      { "nome": "Jovane", "posicoes": ["EXD"], "ovr": 72 },
      { "nome": "Declercq", "posicoes": ["PL"], "ovr": 76 },
      { "nome": "Milovac", "posicoes": ["PL"], "ovr": 74 }
    ]
  },
  {
    "id": "far_1995",
    "nomeEquipa": "Farense 1995",
    "jogadores": [
      { "nome": "Lemajic", "posicoes": ["GR"], "ovr": 76 },
      { "nome": "General", "posicoes": ["DD"], "ovr": 72 },
      { "nome": "King", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Helcinho", "posicoes": ["DC"], "ovr": 74 },
      { "nome": "Paixão", "posicoes": ["DE"], "ovr": 75 },
      { "nome": "Morato", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Nuno Campos", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Jorge Soares", "posicoes": ["MC", "DC"], "ovr": 75 },
      { "nome": "Tozé", "posicoes": ["EXD"], "ovr": 76 },
      { "nome": "Hassan Nader", "posicoes": ["PL"], "ovr": 80 },
      { "nome": "Beato", "posicoes": ["PL"], "ovr": 73 },
      { "nome": "Mendonça", "posicoes": ["EXE"], "ovr": 72 }
    ]
  },
  {
    "id": "cam_1999",
    "nomeEquipa": "Campomaiorense 1999",
    "jogadores": [
      { "nome": "Poleksic", "posicoes": ["GR"], "ovr": 74 },
      { "nome": "Quinzinho", "posicoes": ["DD"], "ovr": 71 },
      { "nome": "René Rivas", "posicoes": ["DC"], "ovr": 73 },
      { "nome": "Marco Almeida", "posicoes": ["DC"], "ovr": 74 },
      { "nome": "Bila", "posicoes": ["DE"], "ovr": 72 },
      { "nome": "Mauro Soares", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Nuno Campos", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Jorginho", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Detinho", "posicoes": ["EXD", "PL"], "ovr": 73 },
      { "nome": "Jimmy Floyd Hasselbaink", "posicoes": ["PL"], "ovr": 81 },
      { "nome": "Laelson", "posicoes": ["EXE"], "ovr": 72 },
      { "nome": "Wellington", "posicoes": ["PL"], "ovr": 74 }
    ]
  },
  {
    "id": "bei_1999",
    "nomeEquipa": "Beira-Mar 1999",
    "jogadores": [
      { "nome": "Palatsi", "posicoes": ["GR"], "ovr": 75 },
      { "nome": "Jorge Neves", "posicoes": ["DD"], "ovr": 73 },
      { "nome": "Gila", "posicoes": ["DC"], "ovr": 74 },
      { "nome": "Lobão", "posicoes": ["DC"], "ovr": 74 },
      { "nome": "António Caetano", "posicoes": ["DE"], "ovr": 75 },
      { "nome": "Fusco", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Eusébio", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Saulo", "posicoes": ["MC"], "ovr": 72 },
      { "nome": "Juninho Petrolina", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Fary Faye", "posicoes": ["PL"], "ovr": 78 },
      { "nome": "Ricardo Sousa", "posicoes": ["MC", "EXE"], "ovr": 77 },
      { "nome": "Cílio", "posicoes": ["EXD"], "ovr": 71 }
    ]
  },
  {
    "id": "lei_2002",
    "nomeEquipa": "Leixões 2002",
    "jogadores": [
      { "nome": "Chullapa", "posicoes": ["GR"], "ovr": 72 },
      { "nome": "Nuno Silva", "posicoes": ["DD"], "ovr": 69 },
      { "nome": "Barros", "posicoes": ["DC"], "ovr": 72 },
      { "nome": "José António", "posicoes": ["DC"], "ovr": 71 },
      { "nome": "Nené", "posicoes": ["DE"], "ovr": 70 },
      { "nome": "Zamorano", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Abílio Novais", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Pedras", "posicoes": ["MC", "EXD"], "ovr": 71 },
      { "nome": "Calica", "posicoes": ["EXD"], "ovr": 68 },
      { "nome": "Antchouet", "posicoes": ["PL"], "ovr": 76 },
      { "nome": "Detinho", "posicoes": ["PL"], "ovr": 74 },
      { "nome": "Pedrinhas", "posicoes": ["EXE"], "ovr": 69 }
    ]
  },
  {
    "id": "lei_2003",
    "nomeEquipa": "União Leiria 2003",
    "jogadores": [
      { "nome": "Helton", "posicoes": ["GR"], "ovr": 79 },
      { "nome": "Bilro", "posicoes": ["DD"], "ovr": 74 },
      { "nome": "João Paulo", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Gabriel", "posicoes": ["DC"], "ovr": 73 },
      { "nome": "Edson", "posicoes": ["DE"], "ovr": 75 },
      { "nome": "Fernando Aguiar", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "João Manuel", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Silas", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Maciel", "posicoes": ["EXD", "EXE"], "ovr": 77 },
      { "nome": "Márcio Mixirica", "posicoes": ["PL"], "ovr": 76 },
      { "nome": "Hugo Almeida", "posicoes": ["PL"], "ovr": 74 },
      { "nome": "Alhandra", "posicoes": ["EXE", "DE"], "ovr": 73 }
    ]
  },
  {
    "id": "set_2005",
    "nomeEquipa": "Vitória Setúbal 2004",
    "jogadores": [
      { "nome": "Marco Tábuas", "posicoes": ["GR"], "ovr": 74 },
      { "nome": "Éinho", "posicoes": ["DD"], "ovr": 71 },
      { "nome": "Aorelio", "posicoes": ["DC"], "ovr": 74 },
      { "nome": "Veríssimo", "posicoes": ["DC"], "ovr": 73 },
      { "nome": "Nandinho", "posicoes": ["DE"], "ovr": 72 },
      { "nome": "Sandro", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Manuel Fernandes", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Hélio", "posicoes": ["MC"], "ovr": 75 },
      { "nome": "Bruno Ribeiro", "posicoes": ["EXE", "MC"], "ovr": 74 },
      { "nome": "Jorginho", "posicoes": ["EXD"], "ovr": 76 },
      { "nome": "Albert Meyong", "posicoes": ["PL"], "ovr": 78 },
      { "nome": "Igor", "posicoes": ["PL"], "ovr": 72 }
    ]
  },
  {
    "id": "aca_2012",
    "nomeEquipa": "Académica 2012",
    "jogadores": [
      { "nome": "Peiser", "posicoes": ["GR"], "ovr": 75 },
      { "nome": "Ricardo", "posicoes": ["GR"], "ovr": 71 },
      { "nome": "João Dias", "posicoes": ["DD"], "ovr": 72 },
      { "nome": "Cedric Soares", "posicoes": ["DD"], "ovr": 74 },
      { "nome": "Abdoulaye Ba", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "João Real", "posicoes": ["DC"], "ovr": 73 },
      { "nome": "Flávio Ferreira", "posicoes": ["DC", "MC"], "ovr": 74 },
      { "nome": "Hélder Cabral", "posicoes": ["DE"], "ovr": 73 },
      { "nome": "Diogo Melo", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Adrien Silva", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "David Simão", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Cleyton", "posicoes": ["MC"], "ovr": 72 },
      { "nome": "Marinho", "posicoes": ["EXD"], "ovr": 75 },
      { "nome": "Diogo Valente", "posicoes": ["EXE"], "ovr": 74 },
      { "nome": "Éder", "posicoes": ["PL"], "ovr": 76 },
      { "nome": "Edinho", "posicoes": ["PL"], "ovr": 75 }
    ]
  },
  {
    "id": "pac_2013",
    "nomeEquipa": "Paços Ferreira 2013",
    "jogadores": [
      { "nome": "Cássio", "posicoes": ["GR"], "ovr": 77 },
      { "nome": "António Filipe", "posicoes": ["GR"], "ovr": 70 },
      { "nome": "Tony", "posicoes": ["DD"], "ovr": 74 },
      { "nome": "Tiago Valente", "posicoes": ["DC"], "ovr": 73 },
      { "nome": "Ricardo", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Nuno Santos", "posicoes": ["DC"], "ovr": 71 },
      { "nome": "Diogo Figueiras", "posicoes": ["DE", "DD"], "ovr": 75 },
      { "nome": "Filipe Anunciação", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "André Leão", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Luiz Carlos", "posicoes": ["MC"], "ovr": 76 },
      { "nome": "Josué", "posicoes": ["MC", "EXD", "EXE"], "ovr": 78 },
      { "nome": "Vítor", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Hurtado", "posicoes": ["EXD", "EXE"], "ovr": 77 },
      { "nome": "Caetano", "posicoes": ["EXE"], "ovr": 73 },
      { "nome": "Manuel JoséCenter", "posicoes": ["EXD"], "ovr": 74 },
      { "nome": "Cícero", "posicoes": ["PL"], "ovr": 76 },
      { "nome": "Jaime Poulsen", "posicoes": ["PL"], "ovr": 70 }
    ]
  },
  {
    "id": "ave_2018",
    "nomeEquipa": "Aves 2018",
    "jogadores": [
      { "nome": "Quim", "posicoes": ["GR"], "ovr": 74 },
      { "nome": "Adriano Facchini", "posicoes": ["GR"], "ovr": 72 },
      { "nome": "Rodrigo Soares", "posicoes": ["DD"], "ovr": 73 },
      { "nome": "Carlos Ponck", "posicoes": ["DC"], "ovr": 74 },
      { "nome": "Diego Galo", "posicoes": ["DC"], "ovr": 73 },
      { "nome": "Rodrigo Defendi", "posicoes": ["DC"], "ovr": 71 },
      { "nome": "Nelson Lenho", "posicoes": ["DE"], "ovr": 72 },
      { "nome": "Vítor Gomes", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Claudio Falcão", "posicoes": ["MC"], "ovr": 73 },
      { "nome": "Nildo Petrolina", "posicoes": ["MC", "EXE"], "ovr": 74 },
      { "nome": "Paulo Machado", "posicoes": ["MC"], "ovr": 74 },
      { "nome": "Amilton", "posicoes": ["EXD"], "ovr": 75 },
      { "nome": "Salvador Agra", "posicoes": ["EXD", "EXE"], "ovr": 74 },
      { "nome": "Mama Baldé", "posicoes": ["EXE", "DD"], "ovr": 73 },
      { "nome": "Alexandre Guedes", "posicoes": ["PL"], "ovr": 75 },
      { "nome": "Derley", "posicoes": ["PL"], "ovr": 72 }
    ]
  },
  {
    "id": "tor_2026",
    "nomeEquipa": "Torreense 2026",
    "jogadores": [
      { "nome": "Lucas Paes", "posicoes": ["GR"], "ovr": 72 },
      { "nome": "Unai Pérez", "posicoes": ["GR"], "ovr": 68 },
      { "nome": "David Bruno", "posicoes": ["DD"], "ovr": 69 },
      { "nome": "Stopira", "posicoes": ["DC"], "ovr": 74 },
      { "nome": "Danilo Ferreira", "posicoes": ["DC"], "ovr": 68 },
      { "nome": "Arnau Casas", "posicoes": ["DC"], "ovr": 68 },
      { "nome": "Mohamed Alia-Diadié", "posicoes": ["DC"], "ovr": 70 },
      { "nome": "Javi Vázquez", "posicoes": ["DE"], "ovr": 68 },
      { "nome": "Guilherme Liberato", "posicoes": ["MC"], "ovr": 72 },
      { "nome": "Leo Silva", "posicoes": ["MC"], "ovr": 69 },
      { "nome": "Pité", "posicoes": ["MC"], "ovr": 69 },
      { "nome": "André Simões", "posicoes": ["MC"], "ovr": 69 },
      { "nome": "Costinha", "posicoes": ["MC"], "ovr": 71 },
      { "nome": "Dany Jean", "posicoes": ["EXE"], "ovr": 70 },
      { "nome": "Luis Quintero", "posicoes": ["EXD"], "ovr": 71 },
      { "nome": "Kévin Zohi", "posicoes": ["PL"], "ovr": 72 },
      { "nome": "Musa Drammeh", "posicoes": ["PL"], "ovr": 71 }
    ]
  }
   ,
// ==========================================
// PARTE 6: EQUIPAS INTERNACIONAIS (CHAMPIONS)
// ==========================================
  {
    "id": "rm_2017",
    "nomeEquipa": "Real Madrid 2017",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Keylor Navas", "posicoes": ["GR"], "ovr": 85 },
      { "nome": "Dani Carvajal", "posicoes": ["DD"], "ovr": 84 },
      { "nome": "Sergio Ramos", "posicoes": ["DC"], "ovr": 89 },
      { "nome": "Raphaël Varane", "posicoes": ["DC"], "ovr": 85 },
      { "nome": "Marcelo", "posicoes": ["DE"], "ovr": 87 },
      { "nome": "Casemiro", "posicoes": ["MC"], "ovr": 86 },
      { "nome": "Toni Kroos", "posicoes": ["MC"], "ovr": 88 },
      { "nome": "Luka Modrić", "posicoes": ["MC"], "ovr": 89 },
      { "nome": "Isco", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Karim Benzema", "posicoes": ["PL"], "ovr": 86 },
      { "nome": "Cristiano Ronaldo", "posicoes": ["PL", "EXE"], "ovr": 94 }
    ]
  },
  {
    "id": "manc_2023",
    "nomeEquipa": "Manchester City 2023",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Ederson", "posicoes": ["GR"], "ovr": 86 },
      { "nome": "Kyle Walker", "posicoes": ["DD"], "ovr": 84 },
      { "nome": "Rúben Dias", "posicoes": ["DC"], "ovr": 88 },
      { "nome": "Manuel Akanji", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Nathan Aké", "posicoes": ["DE", "DC"], "ovr": 81 },
      { "nome": "Rodri", "posicoes": ["MC"], "ovr": 89 },
      { "nome": "John Stones", "posicoes": ["MC", "DC"], "ovr": 83 },
      { "nome": "Kevin De Bruyne", "posicoes": ["MC"], "ovr": 91 },
      { "nome": "Bernardo Silva", "posicoes": ["EXD", "MC"], "ovr": 87 },
      { "nome": "Jack Grealish", "posicoes": ["EXE"], "ovr": 84 },
      { "nome": "Erling Haaland", "posicoes": ["PL"], "ovr": 91 }
    ]
  },
  {
    "id": "liv_2019",
    "nomeEquipa": "Liverpool 2019",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Alisson Becker", "posicoes": ["GR"], "ovr": 89 },
      { "nome": "Trent Alexander-Arnold", "posicoes": ["DD"], "ovr": 85 },
      { "nome": "Virgil van Dijk", "posicoes": ["DC"], "ovr": 90 },
      { "nome": "Joel Matip", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Andrew Robertson", "posicoes": ["DE"], "ovr": 85 },
      { "nome": "Fabinho", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Jordan Henderson", "posicoes": ["MC"], "ovr": 83 },
      { "nome": "Georginio Wijnaldum", "posicoes": ["MC"], "ovr": 82 },
      { "nome": "Mohamed Salah", "posicoes": ["EXD"], "ovr": 89 },
      { "nome": "Sadio Mané", "posicoes": ["EXE"], "ovr": 88 },
      { "nome": "Roberto Firmino", "posicoes": ["PL", "MC"], "ovr": 85 }
    ]
  },
  {
    "id": "bay_2020",
    "nomeEquipa": "Bayern Munique 2020",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Manuel Neuer", "posicoes": ["GR"], "ovr": 89 },
      { "nome": "Joshua Kimmich", "posicoes": ["DD", "MC"], "ovr": 87 },
      { "nome": "Jérôme Boateng", "posicoes": ["DC"], "ovr": 81 },
      { "nome": "David Alaba", "posicoes": ["DC", "DE"], "ovr": 84 },
      { "nome": "Alphonso Davies", "posicoes": ["DE"], "ovr": 81 },
      { "nome": "Leon Goretzka", "posicoes": ["MC"], "ovr": 84 },
      { "nome": "Thiago Alcântara", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Thomas Müller", "posicoes": ["MC", "PL"], "ovr": 86 },
      { "nome": "Serge Gnabry", "posicoes": ["EXD"], "ovr": 84 },
      { "nome": "Kingsley Coman", "posicoes": ["EXE"], "ovr": 83 },
      { "nome": "Robert Lewandowski", "posicoes": ["PL"], "ovr": 92 }
    ]
  },
  {
    "id": "int_2003",
    "nomeEquipa": "Inter de Milão 2003",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Francesco Toldo", "posicoes": ["GR"], "ovr": 86 },
      { "nome": "Javier Zanetti", "posicoes": ["DD", "MC"], "ovr": 86 },
      { "nome": "Fabio Cannavaro", "posicoes": ["DC"], "ovr": 88 },
      { "nome": "Marco Materazzi", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Francesco Coco", "posicoes": ["DE"], "ovr": 79 },
      { "nome": "Luigi Di Biagio", "posicoes": ["MC"], "ovr": 81 },
      { "nome": "Cristiano Zanetti", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Emre Belözoğlu", "posicoes": ["MC"], "ovr": 82 },
      { "nome": "Álvaro Recoba", "posicoes": ["EXE", "MC"], "ovr": 84 },
      { "nome": "Hernán Crespo", "posicoes": ["PL"], "ovr": 86 },
      { "nome": "Christian Vieri", "posicoes": ["PL"], "ovr": 88 }
    ]
  },
  {
    "id": "juv_2003",
    "nomeEquipa": "Juventus 2003",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Gianluigi Buffon", "posicoes": ["GR"], "ovr": 91 },
      { "nome": "Lilian Thuram", "posicoes": ["DD", "DC"], "ovr": 88 },
      { "nome": "Ciro Ferrara", "posicoes": ["DC"], "ovr": 83 },
      { "nome": "Igor Tudor", "posicoes": ["DC", "MC"], "ovr": 80 },
      { "nome": "Gianluca Zambrotta", "posicoes": ["DE", "DD"], "ovr": 85 },
      { "nome": "Edgar Davids", "posicoes": ["MC"], "ovr": 87 },
      { "nome": "Alessio Tacchinardi", "posicoes": ["MC"], "ovr": 81 },
      { "nome": "Mauro Camoranesi", "posicoes": ["EXD"], "ovr": 83 },
      { "nome": "Pavel Nedvěd", "posicoes": ["MC", "EXE"], "ovr": 90 },
      { "nome": "Alessandro Del Piero", "posicoes": ["PL", "MC"], "ovr": 87 },
      { "nome": "David Trezeguet", "posicoes": ["PL"], "ovr": 86 }
    ]
  },
  {
    "id": "acm_2005",
    "nomeEquipa": "AC Milan 2005",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Dida", "posicoes": ["GR"], "ovr": 85 },
      { "nome": "Cafu", "posicoes": ["DD"], "ovr": 87 },
      { "nome": "Alessandro Nesta", "posicoes": ["DC"], "ovr": 89 },
      { "nome": "Jaap Stam", "posicoes": ["DC"], "ovr": 86 },
      { "nome": "Paolo Maldini", "posicoes": ["DE", "DC"], "ovr": 89 },
      { "nome": "Gennaro Gattuso", "posicoes": ["MC"], "ovr": 84 },
      { "nome": "Andrea Pirlo", "posicoes": ["MC"], "ovr": 88 },
      { "nome": "Clarence Seedorf", "posicoes": ["MC"], "ovr": 87 },
      { "nome": "Kaká", "posicoes": ["MC"], "ovr": 90 },
      { "nome": "Andriy Shevchenko", "posicoes": ["PL"], "ovr": 90 },
      { "nome": "Hernán Crespo", "posicoes": ["PL"], "ovr": 84 }
    ]
  },
  {
    "id": "psv_2005",
    "nomeEquipa": "PSV Eindhoven 2005",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Heurelho Gomes", "posicoes": ["GR"], "ovr": 81 },
      { "nome": "Kasper Bøgelund", "posicoes": ["DD"], "ovr": 75 },
      { "nome": "Alex", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Wilfred Bouma", "posicoes": ["DC", "DE"], "ovr": 78 },
      { "nome": "Young-pyo Lee", "posicoes": ["DE", "DD"], "ovr": 78 },
      { "nome": "Johann Vogel", "posicoes": ["MC"], "ovr": 79 },
      { "nome": "Mark van Bommel", "posicoes": ["MC"], "ovr": 83 },
      { "nome": "Phillip Cocu", "posicoes": ["MC", "DC"], "ovr": 82 },
      { "nome": "Park Ji-sung", "posicoes": ["EXD", "MC"], "ovr": 80 },
      { "nome": "DaMarcus Beasley", "posicoes": ["EXE"], "ovr": 77 },
      { "nome": "Jan Vennegoor of Hesselink", "posicoes": ["PL"], "ovr": 79 }
    ]
  },
  {
    "id": "lyo_2005",
    "nomeEquipa": "Lyon 2005",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Grégory Coupet", "posicoes": ["GR"], "ovr": 83 },
      { "nome": "Anthony Réveillère", "posicoes": ["DD"], "ovr": 78 },
      { "nome": "Cris", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Cláudio Caçapa", "posicoes": ["DC"], "ovr": 78 },
      { "nome": "Éric Abidal", "posicoes": ["DE"], "ovr": 80 },
      { "nome": "Michael Essien", "posicoes": ["MC"], "ovr": 84 },
      { "nome": "Mahamadou Diarra", "posicoes": ["MC"], "ovr": 81 },
      { "nome": "Juninho Pernambucano", "posicoes": ["MC"], "ovr": 86 },
      { "nome": "Sidney Govou", "posicoes": ["EXD"], "ovr": 80 },
      { "nome": "Florent Malouda", "posicoes": ["EXE"], "ovr": 81 },
      { "nome": "Sylvain Wiltord", "posicoes": ["PL", "EXD"], "ovr": 81 }
    ]
  },
  {
    "id": "val_2001",
    "nomeEquipa": "Valência 2001",
    "jogadores": [
      { "nome": "Santiago Cañizares", "posicoes": ["GR"], "ovr": 85 },
      { "nome": "Jocelyn Angloma", "posicoes": ["DD"], "ovr": 80 },
      { "nome": "Roberto Ayala", "posicoes": ["DC"], "ovr": 86 },
      { "nome": "Mauricio Pellegrino", "posicoes": ["DC"], "ovr": 81 },
      { "nome": "Amedeo Carboni", "posicoes": ["DE"], "ovr": 80 },
      { "nome": "Rubén Baraja", "posicoes": ["MC"], "ovr": 83 },
      { "nome": "Gaizka Mendieta", "posicoes": ["MC", "EXD"], "ovr": 87 },
      { "nome": "Kily González", "posicoes": ["EXE"], "ovr": 84 },
      { "nome": "Pablo Aimar", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Juan Sánchez", "posicoes": ["PL"], "ovr": 79 },
      { "nome": "John Carew", "posicoes": ["PL"], "ovr": 81 }
    ]
  },
  {
    "id": "dep_2004",
    "nomeEquipa": "Deportivo Corunha 2004",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "José Francisco Molina", "posicoes": ["GR"], "ovr": 81 },
      { "nome": "Manuel Pablo", "posicoes": ["DD"], "ovr": 79 },
      { "nome": "Jorge Andrade", "posicoes": ["DC"], "ovr": 84 },
      { "nome": "Noureddine Naybet", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Joan Capdevila", "posicoes": ["DE"], "ovr": 80 },
      { "nome": "Mauro Silva", "posicoes": ["MC"], "ovr": 83 },
      { "nome": "Sergio González", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Juan Carlos Valerón", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Víctor Sánchez", "posicoes": ["EXD"], "ovr": 80 },
      { "nome": "Albert Luque", "posicoes": ["EXE"], "ovr": 82 },
      { "nome": "Walter Pandiani", "posicoes": ["PL"], "ovr": 81 }
    ]
  },
  {
    "id": "mon_2004",
    "nomeEquipa": "Mónaco 2004",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Flavio Roma", "posicoes": ["GR"], "ovr": 81 },
      { "nome": "Hugo Ibarra", "posicoes": ["DD"], "ovr": 79 },
      { "nome": "Julien Rodriguez", "posicoes": ["DC"], "ovr": 78 },
      { "nome": "Gaël Givet", "posicoes": ["DC", "DE"], "ovr": 79 },
      { "nome": "Patrice Evra", "posicoes": ["DE"], "ovr": 81 },
      { "nome": "Lucas Bernardi", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Akis Zikos", "posicoes": ["MC"], "ovr": 77 },
      { "nome": "Ludovic Giuly", "posicoes": ["EXD", "MC"], "ovr": 84 },
      { "nome": "Jérôme Rothen", "posicoes": ["EXE"], "ovr": 83 },
      { "nome": "Fernando Morientes", "posicoes": ["PL"], "ovr": 85 },
      { "nome": "Dado Pršo", "posicoes": ["PL"], "ovr": 80 }
    ]
  },
  {
    "id": "lev_2002",
    "nomeEquipa": "Bayer Leverkusen 2002",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Hans-Jörg Butt", "posicoes": ["GR"], "ovr": 81 },
      { "nome": "Zoltán Sebescen", "posicoes": ["DD"], "ovr": 76 },
      { "nome": "Jens Nowotny", "posicoes": ["DC"], "ovr": 84 },
      { "nome": "Lúcio", "posicoes": ["DC"], "ovr": 86 },
      { "nome": "Diego Placente", "posicoes": ["DE"], "ovr": 79 },
      { "nome": "Carsten Ramelow", "posicoes": ["MC", "DC"], "ovr": 80 },
      { "nome": "Michael Ballack", "posicoes": ["MC"], "ovr": 89 },
      { "nome": "Bernd Schneider", "posicoes": ["EXD", "MC"], "ovr": 83 },
      { "nome": "Zé Roberto", "posicoes": ["EXE", "DE"], "ovr": 85 },
      { "nome": "Oliver Neuville", "posicoes": ["PL", "EXD"], "ovr": 82 },
      { "nome": "Dimitar Berbatov", "posicoes": ["PL"], "ovr": 80 }
    ]
  },
  {
    "id": "int_2026",
    "nomeEquipa": "Inter de Milão 2025",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Yann Sommer", "posicoes": ["GR"], "ovr": 84 },
      { "nome": "Denzel Dumfries", "posicoes": ["DD", "EXD"], "ovr": 81 },
      { "nome": "Benjamin Pavard", "posicoes": ["DC", "DD"], "ovr": 83 },
      { "nome": "Alessandro Bastoni", "posicoes": ["DC"], "ovr": 85 },
      { "nome": "Federico Dimarco", "posicoes": ["DE", "EXE"], "ovr": 84 },
      { "nome": "Nicolò Barella", "posicoes": ["MC"], "ovr": 86 },
      { "nome": "Hakan Çalhanoğlu", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Henrikh Mkhitaryan", "posicoes": ["MC"], "ovr": 81 },
      { "nome": "Marcus Thuram", "posicoes": ["PL", "EXE"], "ovr": 83 },
      { "nome": "Lautaro Martínez", "posicoes": ["PL"], "ovr": 89 },
      { "nome": "Mehdi Taremi", "posicoes": ["PL"], "ovr": 80 }
    ]
  }, // <-- ADICIONADA A VÍRGULA EM FALTA AQUI
  {
    "id": "rm_2000",
    "nomeEquipa": "Real Madrid 2000",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Iker Casillas", "posicoes": ["GR"], "ovr": 83 },
      { "nome": "Míchel Salgado", "posicoes": ["DD"], "ovr": 82 },
      { "nome": "Aitor Karanka", "posicoes": ["DC"], "ovr": 80 },
      { "nome": "Iván Campo", "posicoes": ["DC"], "ovr": 79 },
      { "nome": "Roberto Carlos", "posicoes": ["DE"], "ovr": 89 },
      { "nome": "Fernando Redondo", "posicoes": ["MC"], "ovr": 88 },
      { "nome": "Steve McManaman", "posicoes": ["MC", "EXD"], "ovr": 84 },
      { "nome": "Iván Helguera", "posicoes": ["MC", "DC"], "ovr": 83 },
      { "nome": "Raúl", "posicoes": ["PL", "MC"], "ovr": 89 },
      { "nome": "Nicolas Anelka", "posicoes": ["PL"], "ovr": 83 },
      { "nome": "Fernando Morientes", "posicoes": ["PL"], "ovr": 84 }
    ]
  },
  {
    "id": "fcb_2006",
    "nomeEquipa": "Barcelona 2006",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Víctor Valdés", "posicoes": ["GR"], "ovr": 83 },
      { "nome": "Oleguer", "posicoes": ["DD", "DC"], "ovr": 77 },
      { "nome": "Carles Puyol", "posicoes": ["DC"], "ovr": 88 },
      { "nome": "Rafael Márquez", "posicoes": ["DC", "MC"], "ovr": 84 },
      { "nome": "Giovanni van Bronckhorst", "posicoes": ["DE"], "ovr": 81 },
      { "nome": "Edmílson", "posicoes": ["MC"], "ovr": 81 },
      { "nome": "Mark van Bommel", "posicoes": ["MC"], "ovr": 82 },
      { "nome": "Deco", "posicoes": ["MC"], "ovr": 88 },
      { "nome": "Ludovic Giuly", "posicoes": ["EXD"], "ovr": 82 },
      { "nome": "Ronaldinho Gaúcho", "posicoes": ["EXE"], "ovr": 93 },
      { "nome": "Samuel Eto'o", "posicoes": ["PL"], "ovr": 89 }
    ]
  },
  {
    "id": "acm_1994",
    "nomeEquipa": "AC Milan 1994",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Sebastiano Rossi", "posicoes": ["GR"], "ovr": 85 },
      { "nome": "Mauro Tassotti", "posicoes": ["DD"], "ovr": 83 },
      { "nome": "Filippo Galli", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Paolo Maldini", "posicoes": ["DC", "DE"], "ovr": 92 },
      { "nome": "Christian Panucci", "posicoes": ["DE", "DD"], "ovr": 84 },
      { "nome": "Demetrio Albertini", "posicoes": ["MC"], "ovr": 87 },
      { "nome": "Marcel Desailly", "posicoes": ["MC", "DC"], "ovr": 89 },
      { "nome": "Roberto Donadoni", "posicoes": ["EXD", "MC"], "ovr": 85 },
      { "nome": "Zvonimir Boban", "posicoes": ["MC"], "ovr": 86 },
      { "nome": "Dejan Savićević", "posicoes": ["PL", "MC"], "ovr": 88 },
      { "nome": "Daniele Massaro", "posicoes": ["PL"], "ovr": 83 }
    ]
  },
  {
    "id": "bay_2001",
    "nomeEquipa": "Bayern Munique 2001",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Oliver Kahn", "posicoes": ["GR"], "ovr": 89 },
      { "nome": "Willy Sagnol", "posicoes": ["DD"], "ovr": 83 },
      { "nome": "Samuel Kuffour", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Patrik Andersson", "posicoes": ["DC"], "ovr": 83 },
      { "nome": "Thomas Linke", "posicoes": ["DC"], "ovr": 81 },
      { "nome": "Bixente Lizarazu", "posicoes": ["DE"], "ovr": 86 },
      { "nome": "Owen Hargreaves", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Stefan Effenberg", "posicoes": ["MC"], "ovr": 87 },
      { "nome": "Mehmet Scholl", "posicoes": ["MC"], "ovr": 84 },
      { "nome": "Hasan Salihamidžić", "posicoes": ["EXD", "DD"], "ovr": 81 },
      { "nome": "Giovane Élber", "posicoes": ["PL"], "ovr": 85 }
    ]
  },
  {
    "id": "ajx_1995",
    "nomeEquipa": "Ajax 1995",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Edwin van der Sar", "posicoes": ["GR"], "ovr": 86 },
      { "nome": "Michael Reiziger", "posicoes": ["DD"], "ovr": 81 },
      { "nome": "Danny Blind", "posicoes": ["DC"], "ovr": 84 },
      { "nome": "Frank de Boer", "posicoes": ["DC", "DE"], "ovr": 85 },
      { "nome": "Clarence Seedorf", "posicoes": ["MC"], "ovr": 83 },
      { "nome": "Edgar Davids", "posicoes": ["MC"], "ovr": 84 },
      { "nome": "Ronald de Boer", "posicoes": ["MC", "PL"], "ovr": 83 },
      { "nome": "Jari Litmanen", "posicoes": ["MC"], "ovr": 88 },
      { "nome": "Finidi George", "posicoes": ["EXD"], "ovr": 83 },
      { "nome": "Marc Overmars", "posicoes": ["EXE"], "ovr": 85 },
      { "nome": "Patrick Kluivert", "posicoes": ["PL"], "ovr": 84 }
    ]
  },
  {
    "id": "int_2010_ch",
    "nomeEquipa": "Inter de Milão 2010",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Júlio César", "posicoes": ["GR"], "ovr": 88 },
      { "nome": "Maicon", "posicoes": ["DD"], "ovr": 88 },
      { "nome": "Lúcio", "posicoes": ["DC"], "ovr": 86 },
      { "nome": "Walter Samuel", "posicoes": ["DC"], "ovr": 85 },
      { "nome": "Cristian Chivu", "posicoes": ["DE"], "ovr": 81 },
      { "nome": "Javier Zanetti", "posicoes": ["MC", "DE"], "ovr": 86 },
      { "nome": "Esteban Cambiasso", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Wesley Sneijder", "posicoes": ["MC"], "ovr": 90 },
      { "nome": "Samuel Eto'o", "posicoes": ["EXD", "PL"], "ovr": 89 },
      { "nome": "Goran Pandev", "posicoes": ["EXE"], "ovr": 80 },
      { "nome": "Diego Milito", "posicoes": ["PL"], "ovr": 87 }
    ]
  },
  {
    "id": "liv_1977",
    "nomeEquipa": "Liverpool 1977",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Ray Clemence", "posicoes": ["GR"], "ovr": 85 },
      { "nome": "Phil Neal", "posicoes": ["DD"], "ovr": 83 },
      { "nome": "Tommy Smith", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Emlyn Hughes", "posicoes": ["DC", "DE"], "ovr": 85 },
      { "nome": "Joey Jones", "posicoes": ["DE"], "ovr": 78 },
      { "nome": "Jimmy Case", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Ian Callaghan", "posicoes": ["MC"], "ovr": 81 },
      { "nome": "Ray Kennedy", "posicoes": ["MC", "EXE"], "ovr": 83 },
      { "nome": "Terry McDermott", "posicoes": ["MC"], "ovr": 81 },
      { "nome": "Kevin Keegan", "posicoes": ["PL", "EXD"], "ovr": 89 },
      { "nome": "Jan Toshack", "posicoes": ["PL"], "ovr": 80 }
    ]
  },
  {
    "id": "che_2005",
    "nomeEquipa": "Chelsea 2005",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Petr Čech", "posicoes": ["GR"], "ovr": 88 },
      { "nome": "Paulo Ferreira", "posicoes": ["DD"], "ovr": 82 },
      { "nome": "John Terry", "posicoes": ["DC"], "ovr": 88 },
      { "nome": "Ricardo Carvalho", "posicoes": ["DC"], "ovr": 87 },
      { "nome": "William Gallas", "posicoes": ["DE", "DC"], "ovr": 84 },
      { "nome": "Claude Makélélé", "posicoes": ["MC"], "ovr": 87 },
      { "nome": "Tiago Mendes", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Frank Lampard", "posicoes": ["MC"], "ovr": 88 },
      { "nome": "Arjen Robben", "posicoes": ["EXD", "EXE"], "ovr": 85 },
      { "nome": "Damien Duff", "posicoes": ["EXE", "EXD"], "ovr": 82 },
      { "nome": "Didier Drogba", "posicoes": ["PL"], "ovr": 86 }
    ]
  },
  {
    "id": "tot_2019",
    "nomeEquipa": "Tottenham 2019",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Hugo Lloris", "posicoes": ["GR"], "ovr": 86 },
      { "nome": "Kieran Trippier", "posicoes": ["DD"], "ovr": 81 },
      { "nome": "Toby Alderweireld", "posicoes": ["DC"], "ovr": 84 },
      { "nome": "Jan Vertonghen", "posicoes": ["DC", "DE"], "ovr": 84 },
      { "nome": "Danny Rose", "posicoes": ["DE"], "ovr": 80 },
      { "nome": "Harry Winks", "posicoes": ["MC"], "ovr": 78 },
      { "nome": "Moussa Sissoko", "posicoes": ["MC", "EXD"], "ovr": 79 },
      { "nome": "Christian Eriksen", "posicoes": ["MC"], "ovr": 86 },
      { "nome": "Dele Alli", "posicoes": ["MC"], "ovr": 82 },
      { "nome": "Son Heung-min", "posicoes": ["EXE", "PL"], "ovr": 85 },
      { "nome": "Harry Kane", "posicoes": ["PL"], "ovr": 89 }
    ]
  },
  {
    "id": "atm_2016",
    "nomeEquipa": "Atlético de Madrid 2016",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Jan Oblak", "posicoes": ["GR"], "ovr": 87 },
      { "nome": "Juanfran", "posicoes": ["DD"], "ovr": 81 },
      { "nome": "Stefan Savić", "posicoes": ["DC"], "ovr": 81 },
      { "nome": "Diego Godín", "posicoes": ["DC"], "ovr": 88 },
      { "nome": "Filipe Luís", "posicoes": ["DE"], "ovr": 84 },
      { "nome": "Gabi", "posicoes": ["MC"], "ovr": 82 },
      { "nome": "Augusto Fernández", "posicoes": ["MC"], "ovr": 79 },
      { "nome": "Koke", "posicoes": ["MC", "EXE"], "ovr": 84 },
      { "nome": "Saúl Ñíguez", "posicoes": ["MC", "EXD"], "ovr": 82 },
      { "nome": "Antoine Griezmann", "posicoes": ["PL", "MC"], "ovr": 88 },
      { "nome": "Fernando Torres", "posicoes": ["PL"], "ovr": 81 }
    ]
  },
  {
    "id": "par_1995",
    "nomeEquipa": "Paris Saint-Germain 1995",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Bernard Lama", "posicoes": ["GR"], "ovr": 85 },
      { "nome": "Oumar Dieng", "posicoes": ["DD", "DC"], "ovr": 77 },
      { "nome": "Alain Roche", "posicoes": ["DC"], "ovr": 81 },
      { "nome": "Ricardo Gomes", "posicoes": ["DC"], "ovr": 84 },
      { "nome": "Patrick Colleter", "posicoes": ["DE"], "ovr": 78 },
      { "nome": "Daniel Bravo", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Vincent Guérin", "posicoes": ["MC"], "ovr": 82 },
      { "nome": "Valdo", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "David Ginola", "posicoes": ["EXE"], "ovr": 86 },
      { "nome": "George Weah", "posicoes": ["PL"], "ovr": 89 },
      { "nome": "Rai", "posicoes": ["MC", "PL"], "ovr": 85 }
    ]
  },
  {
    "id": "bvb_2013",
    "nomeEquipa": "Borussia Dortmund 2013",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Roman Weidenfeller", "posicoes": ["GR"], "ovr": 83 },
      { "nome": "Łukasz Piszczek", "posicoes": ["DD"], "ovr": 82 },
      { "nome": "Neven Subotić", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Mats Hummels", "posicoes": ["DC"], "ovr": 85 },
      { "nome": "Marcel Schmelzer", "posicoes": ["DE"], "ovr": 80 },
      { "nome": "Sven Bender", "posicoes": ["MC"], "ovr": 81 },
      { "nome": "İlkay Gündoğan", "posicoes": ["MC"], "ovr": 84 },
      { "nome": "Jakub Błaszczykowski", "posicoes": ["EXD"], "ovr": 82 },
      { "nome": "Marco Reus", "posicoes": ["EXE", "MC"], "ovr": 86 },
      { "nome": "Mario Götze", "posicoes": ["MC"], "ovr": 85 },
      { "nome": "Robert Lewandowski", "posicoes": ["PL"], "ovr": 88 }
    ]
  },
  {
    "id": "mon_1998",
    "nomeEquipa": "Mónaco 1998",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Fabien Barthez", "posicoes": ["GR"], "ovr": 85 },
      { "nome": "Willy Sagnol", "posicoes": ["DD"], "ovr": 78 },
      { "nome": "Lilian Martin", "posicoes": ["DC"], "ovr": 76 },
      { "nome": "Muhamed Konjić", "posicoes": ["DC"], "ovr": 75 },
      { "nome": "Christophe Pignol", "posicoes": ["DE"], "ovr": 76 },
      { "nome": "Sabri Lamouchi", "posicoes": ["MC"], "ovr": 81 },
      { "nome": "Ali Benarbia", "posicoes": ["MC"], "ovr": 80 },
      { "nome": "Ludovic Giuly", "posicoes": ["EXD"], "ovr": 79 },
      { "nome": "Thierry Henry", "posicoes": ["EXE", "PL"], "ovr": 84 },
      { "nome": "David Trezeguet", "posicoes": ["PL"], "ovr": 83 },
      { "nome": "Victor Ikpeba", "posicoes": ["PL", "EXD"], "ovr": 81 }
    ]
  },
  {
    "id": "fcp_1987_ch",
    "nomeEquipa": "Porto 1987",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Józef Młynarczyk", "posicoes": ["GR"], "ovr": 84 },
      { "nome": "João Pinto", "posicoes": ["DD"], "ovr": 85 },
      { "nome": "Celso Vieira", "posicoes": ["DC"], "ovr": 82 },
      { "nome": "Eduardo Luís", "posicoes": ["DC"], "ovr": 80 },
      { "nome": "Augusto Inácio", "posicoes": ["DE"], "ovr": 81 },
      { "nome": "António André", "posicoes": ["MC"], "ovr": 83 },
      { "nome": "António Sousa", "posicoes": ["MC"], "ovr": 82 },
      { "nome": "Jaime Magalhães", "posicoes": ["EXD"], "ovr": 81 },
      { "nome": "Paulo Futre", "posicoes": ["EXE"], "ovr": 91 },
      { "nome": "Rabah Madjer", "posicoes": ["PL", "EXD"], "ovr": 90 },
      { "nome": "Fernando Gomes", "posicoes": ["PL"], "ovr": 87 }
    ]
  },
  {
    "id": "par_2026",
    "nomeEquipa": "Paris Saint-Germain 2026",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Safonov", "posicoes": ["GR"], "ovr": 82 },
      { "nome": "Hakimi", "posicoes": ["DD"], "ovr": 88 },
      { "nome": "Pacho", "posicoes": ["DC"], "ovr": 86 },
      { "nome": "Marquinhos", "posicoes": ["DC"], "ovr": 84 },
      { "nome": "Nuno Mendes", "posicoes": ["DE"], "ovr": 88 },
      { "nome": "Vitinha", "posicoes": ["MC"], "ovr": 92 },
      { "nome": "João Neves", "posicoes": ["MC"], "ovr": 89 },
      { "nome": "Fabián Ruiz", "posicoes": ["MC"], "ovr": 87 },
      { "nome": "Kvaratskhelia", "posicoes": ["EXE", "PL"], "ovr": 90 },
      { "nome": "Dembélé", "posicoes": ["PL", "EXD", "EXE"], "ovr": 91 },
      { "nome": "Doué", "posicoes": ["EXD", "PL", "EXE"], "ovr": 87 }
    ]
  },
  {
    "id": "slb_1962_ch",
    "nomeEquipa": "Benfica 1962",
    "isChampionsOnly": true,
    "jogadores": [
      { "nome": "Costa Pereira", "posicoes": ["GR"], "ovr": 86 },
      { "nome": "Mario João", "posicoes": ["DD"], "ovr": 80 },
      { "nome": "Germano", "posicoes": ["DC"], "ovr": 88 },
      { "nome": "Angelo Martins", "posicoes": ["DE"], "ovr": 82 },
      { "nome": "Mário Coluna", "posicoes": ["MC"], "ovr": 90 },
      { "nome": "Cavém", "posicoes": ["MC", "DE"], "ovr": 82 },
      { "nome": "José Augusto", "posicoes": ["EXD"], "ovr": 85 },
      { "nome": "António Simões", "posicoes": ["EXE"], "ovr": 86 },
      { "nome": "José Águas", "posicoes": ["PL"], "ovr": 88 },
      { "nome": "Eusébio", "posicoes": ["PL", "EXE", "EXD"], "ovr": 94 },
      { "nome": "José Augusto Torres", "posicoes": ["PL"], "ovr": 81 }
    ]
  }
];
const database = RAW_DATABASE.map(normalizarEquipa);
window.database = database;

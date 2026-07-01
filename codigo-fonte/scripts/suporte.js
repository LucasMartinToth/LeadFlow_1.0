(function() {
    const u = localStorage.getItem("usuarioLogado");
    if (!u && window.location.pathname.includes("main.html")) {
        window.location.href = "index.html";
    }
})();

/* ==================================================================
--- 🙋‍♂️ SAUDAÇÃO --------------------------------------------------
================================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuarioLogado) return;

    const nome = usuarioLogado.nome;

    const horaAtual = new Date().getHours();

    let saudacao = "";

    if (horaAtual >= 5 && horaAtual < 12) {
        saudacao = "Bom dia";
    } else if (horaAtual >= 12 && horaAtual < 18) {
        saudacao = "Boa tarde";
    } else {
        saudacao = "Boa noite";
    }

    const mensagemUsuario = document.getElementById("mensagemUsuario");

    if (mensagemUsuario) {
        mensagemUsuario.innerText = 
        `${saudacao}, ${nome}`;
    }
});

/* --- FIM SAUDAÇÃO -------------------------------------------------- */

/* ==================================================================
--- 🔍 BUSCA -------------------------------------------------------
================================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("search_input");
    if (!searchInput) return;
    searchInput.addEventListener("input", function () {

        const termo = searchInput.value.toLowerCase().trim();

        const rows = document.querySelectorAll(".table_row");

        rows.forEach(row => {

            const nomeEl = row.querySelector(".client_name");
            const nome = nomeEl ? nomeEl.textContent.toLowerCase() : "";

            if (nome.includes(termo)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }

        });
    });
});

/* --- FIM BUSCA -------------------------------------------------- */

let _origemConfirmar = null;

/* ==================================================================
--- RENDERIZAR CLIENTES -----------------------------------------------
================================================================== */

function renderizarCliente(chamado) {

    const tbody = document.getElementById("table_body");

    const dataFormatada = new Date(chamado.data).toLocaleDateString("pt-BR");

    const statusTexto = {
        perdido: "Pendente",
        negociacao: "Em Atendimento",
        ativo: "Resolvido"
    };

    const descricaoCurta =
    chamado.mensagem.length > 15
        ? chamado.mensagem.slice(0, 15) + "..."
        : chamado.mensagem;

    const tr = document.createElement("tr");

    tr.classList.add("table_row");

    tr.setAttribute("data-status", chamado.status);

    tr.innerHTML = `
        <td>
            <label class="checkbox">
                <input type="checkbox" class="checkbox_input row_checkbox">
                <span class="checkbox_custom"></span>
            </label>
        </td>

        <td class="client_cell">
            <div class="client_info">

                <div class="client_profile">
                  ${avatarSVG}
                </div>

                <div>
                    <p class="client_name">${chamado.nome}</p>
                </div>

            </div>
        </td>

        <td class="tipo">${chamado.tipo}</td>

        <td class="descricao"">${descricaoCurta}</td>

        <td class="data">${dataFormatada}</td>

        <td>
            <span class="status badge ${chamado.status}">
                ${statusTexto[chamado.status]}
            </span>
        </td>

        <td class="actions">
            <button
                class="action_btn"
                onClick="abrirModalCliente('${chamado.id}')">
                •••
            </button>
        </td>
    `;

    tbody.appendChild(tr);
}

function atualizarTotalChamados() {
    const chamados = JSON.parse(localStorage.getItem("suporte")) || [];

    document.getElementById("total_chamados").textContent = chamados.length;
}

window.addEventListener("DOMContentLoaded", () => {

    const tbody = document.getElementById("table_body");

    if (!tbody) return;

    const chamados = JSON.parse(localStorage.getItem("suporte")) || [];

    chamados.forEach(chamado => {
        renderizarCliente(chamado);
    });

    atualizarTotalChamados();

});

/* --- FIM RENDERIZAR CLIENTES -------------------------------------- */


/* ==================================================================
--- MODAL -----------------------------------------------------------
================================================================== */

function abrirModal() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    popularSelectsData("diaCadastro", "mesCadastro", "anoCadastro", `${ano}-${mes}-${dia}`);
    document.getElementById("modalCliente").style.display = "flex";
    document.getElementById("nome").focus();
}

function fecharModal() {
    document.getElementById("modalCliente").style.display = "none"
}

/* ==================================================================
--- MODAL EDITAR CLIENTE -------------------------------------------
================================================================== */

function abrirCrudModal(idCliente) {

    const chamados = JSON.parse(localStorage.getItem("suporte")) || [];
    const cliente = chamados.find(c => c.id == idCliente);
    if (!cliente) return;

    document.getElementById("tituloModal").textContent = cliente.nome;
    document.getElementById("statusCrud").value = cliente.status;
    document.getElementById("descricaoCrud").value = cliente.mensagem;
    document.getElementById("crudModal").dataset.idCliente = idCliente;
    document.getElementById("crudModal").style.display = "flex";
}

/* --- FIM MODAL EDITAR CLIENTE ---------------------------------- */

/* ==================================================================
--- MODAL CLIENTE (VISUALIZAÇÃO) -----------------------------------
================================================================== */

function abrirModalCliente(idCliente) {

    const chamados = JSON.parse(localStorage.getItem("suporte")) || [];
    const chamado = chamados.find(c => c.id == idCliente);
    if (!chamado) return;

    const statusTexto = {
        negociacao: "Negociação",
        ativo: "Ativo",
        perdido: "Perdido"
    };

    const dataFormatada = new Date(chamado.data).toLocaleDateString("pt-BR");

    // Preenche infos
    document.getElementById("clienteModalNome").textContent = chamado.nome;
    document.getElementById("clienteModalDescricao").textContent = chamado.mensagem;
    document.getElementById("clienteModalResposta").textContent = chamado.resposta || "";

    // Status badge
    const statusEl = document.getElementById("clienteModalStatus");
    statusEl.textContent = statusTexto[chamado.status];
    statusEl.className = `status badge ${chamado.status}`;

    // Guarda id no modal
    document.getElementById("modalVerCliente").dataset.idCliente = idCliente;

    document.getElementById("modalVerCliente").style.display = "flex";
}

function fecharModalVerCliente() {
    document.getElementById("modalVerCliente").style.display = "none";
}

function abrirEdicaoDeModalCliente() {
    const idCliente = document.getElementById("modalVerCliente").dataset.idCliente;
    fecharModalVerCliente();
    abrirCrudModal(idCliente);
}

function excluirDoModalCliente() {
    _origemConfirmar = "modalVerCliente";
    const idCliente = document.getElementById("modalVerCliente").dataset.idCliente;
    document.getElementById("crudModal").dataset.idCliente = idCliente;
    document.getElementById("modalVerCliente").style.display = "none";
    document.getElementById("modalConfirmar").style.display = "flex";
}

/* --- FIM MODAL CLIENTE (VISUALIZAÇÃO) -------------------------- */

function fecharCrudModal() {

    document
       .getElementById("crudModal")
       .style.display = "none"
}
/* --- FIM MODAL -------------------------------------------------- */

/* ==================================================================
--- SVGs ------------------------------------------------------------
================================================================== */

const avatarSVG = `
<svg class="client_avatar" viewBox="0 0 48 48">
    <path d="M20.534 24.07C20.6569 24.0175 20.7892 23.9903 20.9228 23.9898C21.0565 23.9893 21.1889 24.0156 21.3122 24.0672C21.4355 24.1188 21.5473 24.1945 21.6408 24.29C21.7344 24.3855 21.8078 24.4988 21.8568 24.6231C21.9058 24.7475 21.9294 24.8804 21.9262 25.014C21.9229 25.1477 21.8929 25.2793 21.8379 25.4011C21.7829 25.523 21.7041 25.6325 21.606 25.7234C21.508 25.8142 21.3927 25.8845 21.267 25.93C20.5985 26.1934 20.0248 26.6519 19.6205 27.2458C19.2162 27.8397 19 28.5415 19 29.26V31C19 31.2652 19.1054 31.5196 19.2929 31.7071C19.4804 31.8946 19.7348 32 20 32H28C28.2652 32 28.5196 31.8946 28.7071 31.7071C28.8946 31.5196 29 31.2652 29 31V29.353C29.0001 28.6115 28.7749 27.8874 28.3541 27.2768C27.9334 26.6662 27.337 26.1979 26.644 25.934C26.5175 25.8901 26.4012 25.8213 26.3018 25.7316C26.2024 25.6419 26.1221 25.5332 26.0655 25.4119C26.009 25.2905 25.9773 25.1591 25.9725 25.0253C25.9677 24.8916 25.9897 24.7582 26.0374 24.6331C26.0851 24.508 26.1574 24.3938 26.25 24.2972C26.3427 24.2006 26.4538 24.1235 26.5767 24.0706C26.6997 24.0177 26.832 23.9901 26.9659 23.9893C27.0998 23.9885 27.2324 24.0146 27.356 24.066C28.4276 24.4742 29.3499 25.1983 30.0006 26.1425C30.6514 27.0867 30.9999 28.2063 31 29.353V31C31 31.7956 30.6839 32.5587 30.1213 33.1213C29.5587 33.6839 28.7956 34 28 34H20C19.2044 34 18.4413 33.6839 17.8787 33.1213C17.3161 32.5587 17 31.7956 17 31V29.26C17.0001 28.1402 17.3373 27.0463 17.9676 26.1206C18.5978 25.195 19.4921 24.4805 20.534 24.07ZM24 14C25.0609 14 26.0783 14.4214 26.8284 15.1716C27.5786 15.9217 28 16.9391 28 18V20C28 21.0609 27.5786 22.0783 26.8284 22.8284C26.0783 23.5786 25.0609 24 24 24C22.9391 24 21.9217 23.5786 21.1716 22.8284C20.4214 22.0783 20 21.0609 20 20V18C20 16.9391 20.4214 15.9217 21.1716 15.1716C21.9217 14.4214 22.9391 14 24 14V14ZM24 16C23.4696 16 22.9609 16.2107 22.5858 16.5858C22.2107 16.9609 22 17.4696 22 18V20C22 20.5304 22.2107 21.0391 22.5858 21.4142C22.9609 21.7893 23.4696 22 24 22C24.5304 22 25.0391 21.7893 25.4142 21.4142C25.7893 21.0391 26 20.5304 26 20V18C26 17.4696 25.7893 16.9609 25.4142 16.5858C25.0391 16.2107 24.5304 16 24 16Z" fill="currentColor"/>
</svg>
`;

/* --- FIM SVGs -------------------------------------------------- */

/* ==================================================================
--- CRUD ------------------------------------------------------------
================================================================== */

const statusCadastro = document.getElementById("statusCadastro");

if (statusCadastro) {
    statusCadastro.addEventListener("change", () => {
        statusCadastro.className = `status badge ${statusCadastro.value}`;
    });
}

const statusCrud = document.getElementById("statusCrud");

if (statusCrud) {
    statusCrud.addEventListener("change", () => {
        statusCrud.className = `status badge ${statusCrud.value}`;
    });
}

function salvarAlteracoes() {

    const idChamado = document.getElementById("crudModal").dataset.idCliente;

    const chamados = JSON.parse(localStorage.getItem("suporte")) || [];

    const chamado = chamados.find(c => c.id == idChamado);

    chamado.status = document.getElementById("statusCrud").value;

    chamado.resposta = document.getElementById("respostaCrud").value;

    localStorage.setItem("suporte", JSON.stringify(chamados));

    location.reload();
}

/* --- FIM CRUD -------------------------------------------------- */

/* ==================================================================
--- EXCLUIR CLIENTE -------------------------------------------------
================================================================== */

function excluirCliente(idCliente) {
    let  chamados = JSON.parse(localStorage.getItem("suporte")) || [];

    chamados = chamados.filter(chamado => chamado.id != idCliente);

    localStorage.setItem("suporte", JSON.stringify(chamados));

    let interacoes = JSON.parse(localStorage.getItem("interacoes")) || [];
    interacoes = interacoes.filter(i => i.idCliente != idCliente);
    localStorage.setItem("interacoes", JSON.stringify(interacoes));

    location.reload();
}

function excluirClienteAtual() {
    _origemConfirmar = "crudModal";
    document.getElementById("crudModal").style.display = "none";
    document.getElementById("modalConfirmar").style.display = "flex";
}

function confirmarExclusao() {
    const idCliente = document.getElementById("crudModal").dataset.idCliente;
    excluirCliente(idCliente);
}

function fecharModalConfirmar() {
    document.getElementById("modalConfirmar").style.display = "none";
    if (_origemConfirmar) {
        document.getElementById(_origemConfirmar).style.display = "flex";
        _origemConfirmar = null;
    }
}
/* --- FIM EXCLUIR CLIENTE --------------------------------------- */

/* ==================================================================
--- FILTROS ---------------------------------------------------------
================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const filtros = document.querySelectorAll(".filter");

    filtros.forEach(botao => {

        botao.addEventListener("click", () => {

          filtros.forEach(f => f.classList.remove("active"));
          botao.classList.add("active");

          const filtro = botao.dataset.filter;

          const linhas = document.querySelectorAll(".table_row");

          linhas.forEach(linha => {

              const status = linha.dataset.status;

              if (filtro === "all" || status === filtro) {
                 linha.style.display ="";
              } else {
                  linha.style.display = "none";
              }

            });

        });

    });

});

/* --- FIM FILTROS ----------------------------------------------- */

/* ==================================================================
--- SELECIONAR TODOS ------------------------------------------------
================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const selectAll = document.getElementById("select_all");
    if (!selectAll) return;
    selectAll.addEventListener("change", () => {

        const checkboxes = document.querySelectorAll(".row_checkbox");

        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
    });
});

document.addEventListener("change", (e) => {

    if (!e.target.classList.contains("row_checkbox")) return;

    const checkboxes = document.querySelectorAll(".row_checkbox");

    const marcados = document.querySelectorAll(".row_checkbox:checked");

    document.getElementById("select_all").checked = checkboxes.length === marcados.length;
});

/* --- FIM SELECIONAR TODOS -------------------------------------- */

/* ==================================================================
--- CONFIGURAÇÕES ---------------------------------------------------
================================================================== */

function abrirModalConfiguracoes() {
    document.getElementById("modalConfiguracoes").style.display = "flex";
}

function fecharModalConfiguracoes() {
    document.getElementById("modalConfiguracoes").style.display = "none";
}

function abrirModalSenha() {
    document.getElementById("modalConfiguracoes").style.display = "none";
    document.getElementById("modalSenha").style.display = "flex";
}

function fecharModalSenha() {
    document.getElementById("modalSenha").style.display = "none";
    document.getElementById("modalConfiguracoes").style.display = "flex";
}

/* --- FIM CONFIGURAÇÕES ----------------------------------------- */

/* ==================================================================
--- ALTERAR SENHA ---------------------------------------------------
================================================================== */

async function alterarSenha() {

    const senhaAtual = document.getElementById("senhaAtual").value;
    const novaSenha = document.getElementById("novaSenha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    const hashAtual = await hashSenha(senhaAtual);
    if (hashAtual !== usuarioLogado.senha) {
        mostrarModal("Erro", "Senha atual incorreta.");
        return;
    }

    if (novaSenha !== confirmarSenha) {
        mostrarModal("Erro", "As senhas não coincidem.");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const indice = usuarios.findIndex(
        usuario => usuario.email === usuarioLogado.email
    );

    if (indice === -1) {
        mostrarModal("Erro", "Usuário não encontrado.");
        return;
    }

    const hashNova = await hashSenha(novaSenha);
    usuarios[indice].senha = hashNova;
    usuarioLogado.senha = hashNova;

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

    mostrarModal("Sucesso", "Senha alterada com sucesso!");

    fecharModalSenha();
}

/* --- FIM ALTERAR SENHA ----------------------------------------- */

/* ==================================================================
--- EXCLUIR CONTA ---------------------------------------------------
================================================================== */

function excluirConta() {
    document.getElementById("modalConfiguracoes").style.display = "none";
    document.getElementById("modalConfirmarConta").style.display = "flex";
}

function confirmarExclusaoConta() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Busca o usuário completo para pegar a empresa dele
    const usuarioCompleto = usuarios.find(u => u.usuario === usuarioLogado.nome);

    // Remove o usuário
    usuarios = usuarios.filter(u => u.usuario !== usuarioLogado.nome);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Remove a empresa, se ele era gestor e tinha uma
    if (usuarioCompleto?.empresa) {
        let empresas = JSON.parse(localStorage.getItem("empresas")) || [];
        empresas = empresas.filter(e => e !== usuarioCompleto.empresa);
        localStorage.setItem("empresas", JSON.stringify(empresas));
    }

    localStorage.removeItem("usuarioLogado");
    window.location.href = "../pages/index.html";
}

function fecharModalConfirmarConta() {
    document.getElementById("modalConfirmarConta").style.display = "none";
    document.getElementById("modalConfiguracoes").style.display = "flex";
}

/* --- FIM EXCLUIR CONTA ----------------------------------------- */

/* ==================================================================
--- 🖱️ FECHAR MODAL AO CLICAR FORA ---------------------------------
================================================================== */

window.addEventListener("click", (e) => {
    const modais = document.querySelectorAll(".modal");
    modais.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});

/* --- FIM FECHAR MODAL AO CLICAR FORA --------------------------- */

/* ==================================================================
--- 🖱️ MODAL SUPORTE -----------------------------------------
================================================================== */

function limparFormularioSuporte() {

    document.getElementById("suporteNome").value = "";
    document.getElementById("suporteEmail").value = "";
    document.getElementById("suporteTipo").value = "";
    document.getElementById("suporteMensagem").value = "";
    document.getElementById("contadorMensagem").textContent = "0/500";
}

function abrirModalSuporte() {

    document.getElementById("tituloSuporte").textContent = "Fale com o suporte";
    document.getElementById("subtituloSuporte").textContent = "Envie sua dúvida ou problema para nossa equipe.";

    document.getElementById("suporteNome").value = "";
    document.getElementById("suporteEmail").value = "";
    document.getElementById("suporteTipo").value = "";
    document.getElementById("suporteMensagem").value = "";

    document.getElementById("contadorMensagem").textContent = "0/500";

    document.getElementById("modalSuporte").style.display = "flex";
}

function fecharModalSuporte() {

    limparFormularioSuporte();

    document.getElementById("modalSuporte").style.display = "none";
}

function enviarSuporte() {

    const nome = document.getElementById("suporteNome").value.trim();
    const email = document.getElementById("suporteEmail").value.trim();
    const tipo = document.getElementById("suporteTipo").value;
    const mensagem = document.getElementById("suporteMensagem").value.trim();

    if (!nome || !email || !mensagem) {
        mostrarModal(
            "Campos obrigatórios",
            "Preencha todos os campos antes de enviar o chamado."
        );
        return;
    }

    if (!tipo) {
        mostrarModal(
            "Tipo obrigatório",
            "Selecione um tipo de chamado."
        );
        return;
    }

    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailregex.test(email)) {
        mostrarModal(
        "E-mail inválido",
        "Digite um endereço de e-mail válido."
        );
        return;
    };
    

    const chamados = JSON.parse(localStorage.getItem("suporte")) || [];

    chamados.push({
        id: Date.now(),
        nome,
        email,
        tipo,
        mensagem,
        resposta: "",
        status: "perdido",
        data: new Date().toISOString().split("T")[0]
    });

    localStorage.setItem("suporte", JSON.stringify(chamados));

    mostrarModal(
        "Chamado enviado",
        "Sua mensagem foi enviada para a equipe de suporte."
    );

    document.getElementById("suporteNome").value = "";
    document.getElementById("suporteEmail").value = "";
    document.getElementById("suporteTipo").value = "";
    document.getElementById("suporteMensagem").value = "";
    document.getElementById("contadorMensagem").textContent = "0/500";

    limparFormularioSuporte();

    fecharModalSuporte();
}



/* --- FIM MODAL SUPORTE ----------------------------------------- */

/* ==================================================================
---  CONTADOR DE CARACTERES -----------------------------------------
================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const textarea = document.getElementById("suporteMensagem");
    const contador = document.getElementById("contadorMensagem");

    if (!textarea || !contador) return;

    textarea.addEventListener("input", () => {
        contador.textContent =
            `${textarea.value.length}/500`;
    });

});

/* --- FIM CONTADOR DE CARACTERES -------------------------------- */

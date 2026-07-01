(function () {
    const u = localStorage.getItem("usuarioLogado");
    if (!u) window.location.href = "index.html";
})();

/* ==================================================================
--- RENDERIZAR TABELA DE INTERAÇÕES --------------------------------
================================================================== */

const canalTexto = {
    whats: "WhatsApp",
    telefone: "Telefone",
    email: "E-mail",
    pessoalmente: "Pessoalmente"
};

function renderizarTabelaInteracoes() {
    const tbody = document.getElementById("table_body_interacoes");
    tbody.innerHTML = "";

    const interacoes = JSON.parse(localStorage.getItem("interacoes")) || [];
    const clientes   = JSON.parse(localStorage.getItem("clientes"))   || [];

    if (interacoes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="padding:24px 12px; color:rgba(255,255,255,0.4); font-size:14px;">
                    Nenhuma interação cadastrada.
                </td>
            </tr>`;
        return;
    }

    interacoes.forEach(i => {
        const cliente = clientes.find(c => c.id == i.idCliente);
        const nomeCliente = cliente ? cliente.nome : "—";

        const [iAno, iMes, iDia] = i.data.split("-");
        const dataFormatada = new Date(iAno, iMes - 1, iDia).toLocaleDateString("pt-BR");

        const descricaoCurta = i.descricao.length > 30
            ? i.descricao.slice(0, 30) + "..."
            : i.descricao;

        const tr = document.createElement("tr");
        tr.classList.add("table_row", "interacao_row");
        tr.setAttribute("data-titulo", i.titulo.toLowerCase());
        tr.setAttribute("data-cliente", nomeCliente.toLowerCase());
        tr.setAttribute("data-data", i.data);
        tr.setAttribute("data-canal", i.canal);

        tr.innerHTML = `
            <td>
                <label class="checkbox">
                    <input type="checkbox" class="checkbox_input interacao_checkbox">
                    <span class="checkbox_custom"></span>
                </label>
            </td>
            <td>
                <p class="client_name"
                    style="cursor:pointer; text-decoration: underline rgba(255,255,255,0.2)"
                    onclick="abrirModalVerInteracao('${i.id}', 'dashInteracoes')">
                    ${i.titulo}
                </p>
            </td>
            <td class="muted">${nomeCliente}</td>
            <td class="muted">${dataFormatada}</td>
            <td class="muted">${canalTexto[i.canal] || i.canal}</td>
            <td class="muted" title="${i.descricao}">${descricaoCurta}</td>
            <td class="actions">
                <button class="action_btn"
                    onclick="abrirModalVerInteracao('${i.id}', 'dashInteracoes')">•••</button>
            </td>`;

        tbody.appendChild(tr);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    renderizarTabelaInteracoes();
    iniciarOrdenacao();
    iniciarBusca();
    iniciarSelectAll();
});

/* ==================================================================
--- BUSCA ----------------------------------------------------------
================================================================== */

function iniciarBusca() {
    const input = document.getElementById("search_input");
    if (!input) return;
    input.addEventListener("input", function () {
        const termo = this.value.toLowerCase();
        document.querySelectorAll(".interacao_row").forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(termo) ? "" : "none";
        });
    });
}

/* ==================================================================
--- ORDENAÇÃO ------------------------------------------------------
================================================================== */

function iniciarOrdenacao() {
    const colunas = document.querySelectorAll("[data-sort]");

    colunas.forEach(coluna => {
        coluna.addEventListener("click", () => {
            const campo = coluna.dataset.sort;

            // Lê a direção ANTES de limpar as classes
            const novaDirecao = coluna.classList.contains("asc") ? "desc" : "asc";

            colunas.forEach(c => c.classList.remove("asc", "desc", "active"));
            coluna.classList.add("active", novaDirecao);

            const tbody = document.getElementById("table_body_interacoes");
            const rows  = Array.from(tbody.querySelectorAll(".interacao_row"));

            rows.sort((a, b) => {
                const valA = a.dataset[campo] || "";
                const valB = b.dataset[campo] || "";

                if (campo === "data") {
                    const diff = new Date(valA) - new Date(valB);
                    return novaDirecao === "asc" ? diff : -diff;
                }

                const cmp = valA.localeCompare(valB, "pt-BR");
                return novaDirecao === "asc" ? cmp : -cmp;
            });

            rows.forEach(r => tbody.appendChild(r));
        });
    });
}

/* ==================================================================
--- SELECT ALL -----------------------------------------------------
================================================================== */

function iniciarSelectAll() {
    const selectAll = document.getElementById("select_all_interacoes");
    if (!selectAll) return;
    selectAll.addEventListener("change", () => {
        document.querySelectorAll(".interacao_checkbox")
            .forEach(cb => cb.checked = selectAll.checked);
    });
}

/* ==================================================================
--- MODAL VER INTERAÇÃO (nesta página) ----------------------------
================================================================== */

function abrirModalVerInteracao(idInteracao, origem = "dashInteracoes") {
    const interacoes = JSON.parse(localStorage.getItem("interacoes")) || [];
    const interacao  = interacoes.find(i => i.id == idInteracao);
    if (!interacao) return;

    document.getElementById("modalVerInteracao").dataset.origem      = origem;
    document.getElementById("modalVerInteracao").dataset.idInteracao = idInteracao;
    document.getElementById("modalVerInteracao").dataset.idCliente   = interacao.idCliente;

    const canalMap = {
        whats: "WhatsApp", telefone: "Telefone",
        email: "E-mail",   pessoalmente: "Pessoalmente"
    };

    document.getElementById("interacaoModalTitulo").textContent  = interacao.titulo;
    document.getElementById("interacaoModalCanal").textContent   = canalMap[interacao.canal];

    const [vAno, vMes, vDia] = interacao.data.split("-");
    document.getElementById("interacaoModalData").textContent =
        new Date(vAno, vMes - 1, vDia).toLocaleDateString("pt-BR");

    document.getElementById("interacaoModalDescricao").textContent = interacao.descricao;
    document.getElementById("modalVerInteracao").style.display = "flex";
}

function fecharModalVerInteracao() {
    document.getElementById("modalVerInteracao").style.display = "none";
    renderizarTabelaInteracoes();
}

function excluirInteracaoAtual() {
    document.getElementById("modalVerInteracao").style.display = "none";
    document.getElementById("modalConfirmarInteracao").style.display = "flex";
}

function confirmarExclusaoInteracao() {
    const idInteracao = document.getElementById("modalVerInteracao").dataset.idInteracao;
    let interacoes = JSON.parse(localStorage.getItem("interacoes")) || [];
    interacoes = interacoes.filter(i => i.id != idInteracao);
    localStorage.setItem("interacoes", JSON.stringify(interacoes));
    document.getElementById("modalConfirmarInteracao").style.display = "none";
    renderizarTabelaInteracoes();
}

function fecharModalConfirmarInteracao() {
    document.getElementById("modalConfirmarInteracao").style.display = "none";
    document.getElementById("modalVerInteracao").style.display = "flex";
}

function abrirEdicaoInteracao() {
    const idInteracao = document.getElementById("modalVerInteracao").dataset.idInteracao;
    const interacoes  = JSON.parse(localStorage.getItem("interacoes")) || [];
    const interacao   = interacoes.find(i => i.id == idInteracao);
    if (!interacao) return;

    document.getElementById("editInteracaoTitulo").value  = interacao.titulo;
    document.getElementById("editInteracaoCanal").value   = interacao.canal;
    popularSelectsData("diaEditInteracao", "mesEditInteracao", "anoEditInteracao", interacao.data);
    document.getElementById("editInteracaoDescricao").value = interacao.descricao;
    document.getElementById("modalEditarInteracao").dataset.idInteracao = idInteracao;

    document.getElementById("modalVerInteracao").style.display    = "none";
    document.getElementById("modalEditarInteracao").style.display = "flex";
}

function fecharModalEditarInteracao() {
    const idInteracao = document.getElementById("modalEditarInteracao").dataset.idInteracao;
    document.getElementById("modalEditarInteracao").style.display = "none";
    abrirModalVerInteracao(idInteracao);
}

function salvarEdicaoInteracao() {
    const idInteracao = document.getElementById("modalEditarInteracao").dataset.idInteracao;
    const interacoes  = JSON.parse(localStorage.getItem("interacoes")) || [];
    const interacao   = interacoes.find(i => i.id == idInteracao);
    if (!interacao) return;

    interacao.titulo   = document.getElementById("editInteracaoTitulo").value.trim();
    interacao.canal    = document.getElementById("editInteracaoCanal").value;
    interacao.data     = lerData("diaEditInteracao", "mesEditInteracao", "anoEditInteracao");
    interacao.descricao = document.getElementById("editInteracaoDescricao").value.trim();

    localStorage.setItem("interacoes", JSON.stringify(interacoes));
    fecharModalEditarInteracao();
}

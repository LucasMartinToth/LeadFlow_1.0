let redirectAoFechar = null;

// ---- DE login.js ----

async function hashSenha(senha) {
    const encoder = new TextEncoder();
    const data = encoder.encode(senha);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

function mostrarModal(titulo, mensagem, redirect) {
    redirectAoFechar = redirect || null;
    document.getElementById("modalFeedbackTitulo").textContent = titulo;
    document.getElementById("modalFeedbackMensagem").innerHTML = mensagem;
    document.getElementById("modalFeedback").style.display = "flex";
}

function fecharModalFeedback() {
    document.getElementById("modalFeedback").style.display = "none";
    if (redirectAoFechar) {
        window.location.href = redirectAoFechar;
        redirectAoFechar = null;
    }
}

function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}

// ---- DE dashboard.js ----

function popularSelectsData(diaId, mesId, anoId, valorAtual = null) {
    const selectDia = document.getElementById(diaId);
    const selectMes = document.getElementById(mesId);
    const selectAno = document.getElementById(anoId);

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril",
        "Maio", "Junho", "Julho", "Agosto",
        "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const anoAtual = new Date().getFullYear();

    selectDia.innerHTML = "";
    selectMes.innerHTML = "";
    selectAno.innerHTML = "";

    for (let d = 1; d <= 31; d++) {
        const opt = document.createElement("option");
        opt.value = String(d).padStart(2, "0");
        opt.textContent = String(d).padStart(2, "0");
        selectDia.appendChild(opt);
    }

    meses.forEach((mes, i) => {
        const opt = document.createElement("option");
        opt.value = String(i + 1).padStart(2, "0");
        opt.textContent = mes;
        selectMes.appendChild(opt);
    });

    for (let a = anoAtual; a >= anoAtual - 10; a--) {
        const opt = document.createElement("option");
        opt.value = a;
        opt.textContent = a;
        selectAno.appendChild(opt);
    }

    if (valorAtual) {
        const [ano, mes, dia] = valorAtual.split("-");
        selectDia.value = dia;
        selectMes.value = mes;
        selectAno.value = ano;
    }
}

function lerData(diaId, mesId, anoId) {
    const dia = document.getElementById(diaId).value;
    const mes = document.getElementById(mesId).value;
    const ano = document.getElementById(anoId).value;
    return `${ano}-${mes}-${dia}`;
}

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
    const indice = usuarios.findIndex(u => u.email === usuarioLogado.email);

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

function excluirConta() {
    document.getElementById("modalConfiguracoes").style.display = "none";
    document.getElementById("modalConfirmarConta").style.display = "flex";
}

function confirmarExclusaoConta() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioCompleto = usuarios.find(u => u.usuario === usuarioLogado.nome);

    usuarios = usuarios.filter(u => u.usuario !== usuarioLogado.nome);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

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

let redirectAoFechar = null;

/* ==================================================================
--- 🔐 VALIDAÇÕES --------------------------------------------------
================================================================== */

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function senhaValida(senha) {
    return senha.length >= 6;
}

function usuarioExiste(lista, usuario) {
    return lista.some(u =>
        u.usuario.toLowerCase() === usuario.toLowerCase()
    );
}

function emailExiste(lista, email) {
    return lista.some(u =>
        u.email.toLowerCase() === email.toLowerCase()
    );
}

function empresaExiste(lista, empresa) {
    return lista.some(e =>
        e.toLowerCase() === empresa.toLowerCase()
    );
}

/* --- FIM VALIDAÇÕES -------------------------------------------- */


/* ==================================================================
--- 💾 LOCALSTORAGE ------------------------------------------------
================================================================== */

function getUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function setUsuarios(lista) {
    localStorage.setItem("usuarios", JSON.stringify(lista));
}

function getEmpresas() {
    return JSON.parse(localStorage.getItem("empresas")) || [];
}

function setEmpresas(lista) {
    localStorage.setItem("empresas", JSON.stringify(lista));
}

/* --- FIM LOCALSTORAGE ------------------------------------------ */


/* ==================================================================
--- 🧑‍💻 CADASTRO ----------------------------------------------------
================================================================== */

async function cadastrar() {

    const usuario = document.getElementById("cadastroUsuario").value.trim();
    const email = document.getElementById("cadastroEmail").value.trim();
    const senha = document.getElementById("cadastroSenha").value.trim();
    const funcao = document.getElementById("cargo").value.trim();

    const empresaInput = document.getElementById("empresa");
    const empresa = empresaInput ? empresaInput.value.trim() : "";

    let erros = [];
    let validacoes = [];

    const usuarios = getUsuarios();
    const empresas = getEmpresas();

    /* ---- CAMPOS OBRIGATÓRIOS ---- */
    if (!usuario) erros.push("Usuário");
    if (!email) erros.push("E-mail");
    if (!senha) erros.push("Senha");
    if (!funcao) erros.push("Função");

    /* ---- VALIDAÇÕES ---- */
    if (email && !emailValido(email)) {
        validacoes.push("E-mail inválido");
    }

    if (senha && !senhaValida(senha)) {
        validacoes.push("Senha deve ter no mínimo 6 caracteres");
    }

    /* ---- DUPLICADOS ---- */
    if (usuarioExiste(usuarios, usuario)) {
        validacoes.push("Usuário já existe");
    }

    if (emailExiste(usuarios, email)) {
        validacoes.push("E-mail já cadastrado");
    }

    if (empresa && empresaExiste(empresas, empresa)) {
        validacoes.push("Empresa já existe");
    }

    /* ---- BLOQUEIO SE TIVER ERRO ---- */
    if (erros.length || validacoes.length) {
        let mensagem = "";
        if (erros.length)
            mensagem += `<strong>Campos obrigatórios:</strong><br>${erros.join("<br>")}<br>`;
        if (validacoes.length)
            mensagem += `<strong>Atenção:</strong><br>${validacoes.join("<br>")}`;
        mostrarModal("Ops!", mensagem);
        return;
}

    /* ---- SALVAR USUÁRIO ---- */
    const senhaCriptografada = await hashSenha(senha);

    usuarios.push({
        usuario,
        email,
        senha: senhaCriptografada,
        funcao,
        empresa
    });

    setUsuarios(usuarios);

    /* ---- SALVAR EMPRESA ---- */
    if (empresa) {
        empresas.push(empresa);
        setEmpresas(empresas);
    }

    mostrarModal("Conta criada!", "Seu cadastro foi realizado com sucesso.", "index.html");
}

/* --- FIM CADASTRO ---------------------------------------------- */


/* ==================================================================
--- 🔑 LOGIN -------------------------------------------------------
================================================================== */

async function login() {

    const usuario = document.getElementById("loginUsuario").value.trim();
    const senha = document.getElementById("loginSenha").value.trim();
    const empresa = document.getElementById("selectEmpresa").value.trim();

    let erros = [];
    let validacoes = [];

    if (!usuario) erros.push("Usuário ou E-mail");
    if (!senha) erros.push("Senha");
    if (!empresa) erros.push("Empresa");

    if (usuario.includes("@") && !emailValido(usuario)) {
        validacoes.push("E-mail inválido");
    }

    if (erros.length || validacoes.length) {
        let mensagem = "";
        if (erros.length)
            mensagem += `<strong>Campos obrigatórios:</strong><br>${erros.join("<br>")}<br>`;
        if (validacoes.length)
            mensagem += `<strong>Atenção:</strong><br>${validacoes.join("<br>")}`;
        mostrarModal("Ops!", mensagem);
        return;
    }

    const usuarios = getUsuarios();
    const hash = await hashSenha(senha);

    const usuarioEncontrado = usuarios.find(u =>
        (u.usuario === usuario || u.email === usuario) &&
        u.senha === hash
    );

    const usuariosFixos = [
        {
            usuario: "Hylbert",
            senha: "61e3d9c88a8ed28103bbdda6099c4b2b84cd1f3ae989494f1f0c0d615aea76a8",
            empresa: "LeadFlow"
        },
        {
            usuario: "Lucas",
            senha: "8826a59b4c76ef94e2cddb1bd526f7d201c5277a7cb5f79789c29a10db9bdfb8",
            empresa: "LeadFlow"
        }
    ];

    const fixo = usuariosFixos.find(u =>
        (u.usuario === usuario || u.email === usuario) &&
        u.senha === hash &&
        u.empresa === empresa
    );

    if (fixo || usuarioEncontrado) {
        const dadosUsuario = usuarioEncontrado || {
            usuario: fixo.usuario,
            email: "",
            senha: ""
        };
        localStorage.setItem("usuarioLogado", JSON.stringify({
            nome: dadosUsuario.usuario,
            email: dadosUsuario.email,
            senha: dadosUsuario.senha,
            empresa: empresa,
            funcao: dadosUsuario.funcao
        }));

        if (dadosUsuario.funcao === "suporte") {
            window.location.href = "../pages/suporte.html";
        } else {
            window.location.href = "../pages/main.html";
        }
        
    } else {
        mostrarModal("Acesso negado", "Usuário, senha ou empresa incorretos.");
    }
}

/* --- FIM LOGIN ------------------------------------------------- */


/* ==================================================================
--- 🚪🚶 LOGOUT -------------------------------------------------------
================================================================== */

function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}

/* --- FIM LOGOUT ------------------------------------------------- */

/* ==================================================================
--- 🔒 HASH --------------------------------------------------------
================================================================== */

async function hashSenha(senha) {
    const encoder = new TextEncoder();
    const data = encoder.encode(senha);
    const hash = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

/* --- FIM HASH -------------------------------------------------- */


/* ==================================================================
--- 📋 CARREGAR EMPRESAS -------------------------------------------
================================================================== */

function carregarEmpresas() {

    const select = document.getElementById("selectEmpresa");
    if (!select) return;

    const empresas = getEmpresas();

    empresas.forEach(empresa => {

        if (!empresa) return;

        const option = document.createElement("option");
        option.value = empresa;
        option.textContent = empresa;

        select.appendChild(option);
    });
}

carregarEmpresas();

/* --- FIM CARREGAR EMPRESAS ------------------------------------- */


/* ==================================================================
--- 👁️ CONTROLE DE CAMPOS -----------------------------------------
================================================================== */

const cargo = document.getElementById("cargo");
const campoGestor = document.getElementById("campoGestor");

if (cargo && campoGestor) {

    cargo.addEventListener("change", function () {

        if (cargo.value === "gestor") {
            campoGestor.style.display = "block";
        } else {
            campoGestor.style.display = "none";
            document.getElementById("empresa").value = "";
        }
    });
}

/* --- FIM CONTROLE DE CAMPOS ------------------------------------ */

/* ==================================================================
--- 💬 MODAL DE FEEDBACK -------------------------------------------
================================================================== */

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

/* --- FIM MODAL DE FEEDBACK ------------------------------------- */

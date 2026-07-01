# Especificações do Projeto

## Perfis de Usuários

<table>
<tbody>
<tr>
<th colspan="2">Perfil 1: Gestor </th>
</tr>
<tr>
<td width="150px"><b>Descrição</b></td>
<td width="600px">
Responsável pela gestão da equipe de vendas e pelo acompanhamento estratégico do negócio. Possui experiência intermediária com tecnologia e utiliza ferramentas de planilhas no dia a dia. 
</td>
</tr>
<tr>
<td><b>Necessidades</b></td>
<td>
• Visualizar métricas e indicadores de desempenho no dashboard; <br>
• Ter uma visão geral das interações com todos os clientes; <br>
• Tomar decisões estratégicas com base em dados visuais (gráficos e relatórios).
</td>
</tr>
</tbody>
</table>

<table>
<tbody>
<tr>
<th colspan="2">Perfil 2: Vendedor </th>
</tr>
<tr>
<td width="150px"><b>Descrição</b></td>
<td width="600px">
Responsável pelo atendimento e pelas vendas diretamente com o cliente. Utiliza o sistema diariamente para registrar e acompanhar negociações. Conhecimento básico a intermediário em tecnologia.
</td>
</tr>
<tr>
<td><b>Necessidades</b></td>
<td>
• Cadastrar, editar e excluir clientes no sistema; <br>
• Registrar interações com clientes (contatos, propostas, observações); <br>
• Acompanhar o histórico de contatos de cada cliente; <br>
• Criar e acompanhar tarefas e lembretes de follow-up; <br>
• Buscar clientes rapidamente por nome ou empresa.
</td>
</tr>
</tbody>
</table>


<table>
<tbody>
<tr>
<th colspan="2">Perfil 3: Suporte </th>
</tr>
<tr>
<td width="150px"><b>Descrição</b></td>
<td width="600px">
Responsável pelo atendimento de dúvidas, sugestões e solicitações enviadas pelos usuários através do formulário de suporte do sistema. Acessa uma área exclusiva para visualizar, acompanhar e responder às mensagens recebidas. Possui conhecimento básico de informática e atendimento ao cliente.
</td>
</tr>
<tr>
<td><b>Necessidades</b></td>
<td>
• Visualizar as solicitações enviadas pelos usuários; <br>
• Consultar os dados do cliente que abriu o chamado (nome, e-mail e informações fornecidas); <br>
• Responder dúvidas, sugestões ou problemas relatados pelos clientes; <br>
• Acompanhar o histórico de mensagens e respostas de cada atendimento; <br>
• Visualizar a quantidade total de solicitações recebidas; <br>
• Registrar o andamento ou status de cada solicitação de suporte; <br>
• Trabalhar em uma área restrita do sistema, sem acesso às funcionalidades de gestão de clientes, vendas ou relatórios administrativos.
</td>
</tr>
</tbody>
</table>


## Histórias de Usuários e Requisitos Funcionais

Com base na análise das personas foram identificadas as seguintes histórias de usuários, relacionadas com os requisitos funcionais necessários para atender os usuários:

| ID    | Descrição do Requisito | Eu como...              | Quero/Desejo/Preciso                                      | Para                                              | Responsável | Página        |
|-------|------------------------|------------------------|-----------------------------------------------------------|---------------------------------------------------|-------------|--------------|
| RF-01 | Cadastrar conta de usuário | Gestor / Vendedor / Suporte | Cadastrar uma conta de usuário no sistema para começar a utilizar o aplicativo                                       | Começar a utilizar o aplicativo                   | Hylbert     | Login        |
| RF-02 | Gerenciar dados da conta (alteração de senha, exclusão  de conta) | Gestor / Vendedor / Suporte | Gerenciar os dados da minha conta, como senha e exclusão, para manter minhas informações atualizadas e seguras               | Mudar minha senha, usuário ou excluir a minha conta | Hylbert     | Configurações |
| RF-03 | Autenticar e encerrar sessão de usuário | Gestor / Vendedor / Suporte | Autenticar-me no sistema e encerrar minha sessão para garantir segurança no acesso                             | Ter mais segurança ao usar o app                  | Hylbert        | Login        |
| RF-04 | Realizar operações CRUD sobre registros de clientes | Vendedor               | Cadastrar, editar e excluir registros de clientes para manter suas informações atualizadas          | Acessar as informações quando precisar            | Hylbert        | Inicial      |
| RF-05 | Gerenciar status de cada cliente | Vendedor               | Acompanhar e gerenciar o status de cada cliente para monitorar o andamento das negociações                              | Saber andamento da negociação com o cliente       | Lucas       | Cliente      |
| RF-06 | Registrar e consultar interações por cliente | Vendedor      | Registrar e consultar interações com clientes para manter histórico de atendimentos  | Manter um histórico do que já foi feito com o cliente | Lucas       | Cliente      |
| RF-07 | Visualizar painel consolidado de interações com todos os clientes | Gestor / Vendedor  | Visualizar um painel consolidado de interações para ter uma visão geral dos clientes cadastrados | Ter uma visão ampla do negócio                   | Lucas      | Inicial      |
| RF-08 | Ordenar interações por critério temporal (ascendente/descendente) | Gestor / Vendedor  | Ordenar interações por data para facilitar a análise de registros recentes ou antigos       | Encontrar mais facilmente alguma interação específica | Lucas      | Inicial      |
| RF-09 | Gerenciar solicitações de suporte | Suporte        | Visualizar e responder solicitações enviadas pelos usuários         | Realizar o atendimento e acompanhamento dos clientes | Lucas        | Suporte     |
| RF-10 | Realizar busca global de clientes | Vendedor      | Buscar clientes por nome, empresa ou informação para localizá-los rapidamente no sistema           | Encontrar rapidamente o cliente desejado          | Hylbert        | Insights     |

### Requisitos Não Funcionais

Também foi identificada a necessidade dos seguintes requisitos não funcionais:

| ID     | Descrição | Prioridade |
|--------|-----------|------------|
| RNF-01 | Interface responsiva compatível com dispositivos móveis (smartphones e tablets) e desktops, seguindo princípios de design adaptativo (Responsive Web Design). | Média 🟡 |
| RNF-02 | Persistência de dados implementada via LocalStorage do navegador, dispensando infraestrutura de servidor back-end para o escopo do MVP acadêmico. | Alta 🔴 |
| RNF-03 | Tempo de resposta das operações de leitura e escrita não deve exceder 2 segundos sob condições normais de uso. | Média 🟡 |
| RNF-04 | Compatibilidade garantida com as versões estáveis mais recentes dos principais navegadores: Google Chrome, Mozilla Firefox, Microsoft Edge e Apple Safari. | Alta 🔴 |
| RNF-05 | Dados sensíveis, em especial credenciais de acesso, devem ser armazenados mediante aplicação de algoritmo de hash criptográfico, vedando o armazenamento em texto simples. | Média 🟡 |
<br>

> [!WARNING]
> **Nota sobre RNF-02 — LocalStorage**  
>  
> Por se tratar de um protótipo acadêmico (MVP), optou-se pelo uso do LocalStorage do navegador para simplificar a infraestrutura e evitar a necessidade de um servidor back-end. Reconhece-se que essa abordagem possui limitações importantes: os dados podem ser perdidos caso o usuário limpe o cache do navegador e não há sincronização entre dispositivos. Em um cenário de produção, seria necessário substituir essa camada por um banco de dados adequado.

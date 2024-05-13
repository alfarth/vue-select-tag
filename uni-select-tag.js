Vue.component('v-select', VueSelect.VueSelect);
Vue.component('select-tag', {
    model: {
        prop: 'modelTag'
    },
    name: "SelectTag",
    props: {
        label: {
            type: String,
            default: 'Tag'
        },
        labelGerenciar: {
            type: String,
            default: this.label
        },
        modelTag: {
            default: null
        },
        modelTagProp: {
            default: null
        },
        filtroRegistro: {
            default: null
        },
        snOrdenarRegistros: {
            default: true
        },
        dsRota: {
            default: ""  // definir em rota_componentes.config.php
        },
        dsChave: {
            default: ""
        },
        dsNome: {
            default: ""
        },
        disabled: {
            type: Boolean,
            default: false
        },
        multiple: {
            type: Boolean,
            default: false
        },
        snSearch: {
            // type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: ""
        },
        nrLimitCarregar: {
            type: Number,
            default: null
        },
        nrLimitSelecionar: {
            type: Number,
            default: null
        },
        snHabilitarCadastro: {
            type: Boolean,
            default: false,
        },
        functionKeyDownEnter: {
            type: Function,
            default: () => false
        },
        dsAjuda: {
            type: String,
            default: null
        },
        snZerarPesquisaSelecionar: {
            type: Boolean,
            default: false,
        },
        getFiltros: {
            type: Function,
            default: () => false
        },
        filtroAdicional: {
            default: null
        },
        onLoading: {
            type: Function,
            default: () => false
        }
    },

    mixins: [
        mixinFuncoesGerais,
        mixinAlert,
        mixinPaginacao
    ],

    data: () => ({
        modelTag: null,
        sn_carregando_registros: false,
        sn_carregando_gerenciar: false,
        sn_pesquisou_registros: false,
        sn_carregou_registros_padrao: false,
        sn_cadastrando_registro: false,
        arrOptions: [],
        arrGerenciar: [],
        objModalAnterior: null,
        id: "",
        ds_cadastrar: null,
        cd_editar: null,
        nr_registros_por_pagina: 6 // modal
    }),

    computed: {

        getIdRota() {
            return `${this.id}caminhoRota`;
        },

        getCaminhoCarregarInformacoes() {
            // retorna o caminho da rota. Ex /admin/componentes/cursos
            return $(`#${this.getIdRota}`).attr('data-rota-componente') + '/' + this.dsRota;
        },

        getCaminhoGravarInformacoes() {
            // retorna o caminho da rota. Ex data-rota-curso
            return $(`#${this.getIdRota}`).attr('data-rota-componente') + '/' + this.dsRota + '/inserir';
        },

        getCaminhoRemoverRegistro() {
            // retorna o caminho da rota. Ex data-rota-curso
            return $(`#${this.getIdRota}`).attr('data-rota-componente') + '/' + this.dsRota + '/remover';
        },

        getIdModalGerenciamentoRegistros() {
            return this.id + "modal_gerenciar_tags";
        }
    },
    methods: {

        async getOptions(snSearch = false) {

            if (snSearch) {
                return;
            }

            this.sn_carregando_registros = true;

            try {
                let objFiltro = {};

                //carrega os códigos da prop this.filtroRegistro
                if (!this.mixinIsEmpty(this.filtroRegistro)) {
                    objFiltro['arrCdRegistros'] = this.getArrCdRegistrosFiltroRegistro();
                }

                objFiltro['sn_ordenar'] = this.snOrdenarRegistros;

                await this.getRequisicao(objFiltro);

                this.sn_carregando_registros = false;
            } catch (objResponseError) {
                console.error('Erro ao carregar dados no componente <select-tag>');
                this.sn_carregando_registros = false;
                this.arrOptions = [];
                return objResponseError;
            }
        },

        async getRequisicao(objFiltro = {}) {
            if (this.mixinIsEmpty(this.dsRota)) {
                console.error('Rota não configurada <select-tag>.');
                return false;
            }

            if (!this.mixinIsEmpty(objFiltro) && objFiltro.hasOwnProperty("ds_search")) {
                objFiltro = {
                    ds_buscar: objFiltro.ds_search
                }
            }

            // limita a quantidade apenas quando não está filtrando registros por código
            if (this.nrLimitCarregar > 0 && this.mixinIsEmpty(objFiltro?.arrCdRegistros)) {
                objFiltro['nr_qtd_registros'] = this.nrLimitCarregar;
            }

            // permite inserir/alterar/remover os filtros externamente (função callback)
            if (this.getFiltros() != false) {
                objFiltroAux = this.getFiltros(objFiltro);
                if (objFiltroAux != null) {
                    objFiltro = objFiltroAux;
                }
            }

            const objResponse = await axios.post(
                this.getCaminhoCarregarInformacoes,
                objFiltro
            );

            if (objResponse.data.arrRegistros == undefined) {
                this.arrOptions = objResponse.data;
            } else {
                this.arrOptions = objResponse.data.arrRegistros;
            }

            return ((!this.mixinIsEmpty(this.arrOptions)) && (this.arrOptions.length > 0));
        },

        getArrCdRegistrosModel() {
            if (this.mixinIsEmpty(this.modelTag)) {
                return null;
            }

            let arrCdRegistro = [];
            if (this.multiple) {
                this.modelTag.forEach((objTag) => {
                    arrCdRegistro.push(objTag[this.dsChave]);
                });
            } else {
                if (typeof this.modelTag === 'object') {
                    arrCdRegistro.push(this.modelTag[this.dsChave]);
                    return arrCdRegistro;
                }

                arrCdRegistro.push(this.modelTag);
                return arrCdRegistro;
            }

            return arrCdRegistro;
        },

        getArrCdRegistrosFiltroRegistro() {
            if (this.mixinIsEmpty(this.filtroRegistro)) {
                return null;
            }

            let arrCdRegistro = [];
            if (this.multiple) {
                this.filtroRegistro.forEach((objTag) => {
                    arrCdRegistro.push(objTag[this.dsChave]);
                });
            } else {
                if (typeof this.filtroRegistro === 'object') {
                    arrCdRegistro.push(this.filtroRegistro[this.dsChave]);
                    return arrCdRegistro;
                }

                arrCdRegistro.push(this.filtroRegistro);
                return arrCdRegistro;
            }

            return arrCdRegistro;
        },

        onChangeSelecionados(event) {
            // valida o limite de registros selecionaveis
            if ((this.multiple) && (this.nrLimitSelecionar > 0) &&
                (this.modelTag.length > this.nrLimitSelecionar)
            ) {
                // cancela a ação para não permitir selecionar o registro excedente
                event.pop();

                let msgAvisoLimite = $('#mensagensSelectTag').attr('data-attr-msg-limite-selecao');
                let tituloAviso = $('#mensagensSelectTag').attr('data-attr-msg-aviso');
                this.mixinAlertAviso(tituloAviso, msgAvisoLimite);
            }
        },

        changedSelecionados: function (arrSelecionado) {
            this.$emit('input', arrSelecionado);

            // ao selecionar um registro, limpa os registros encontrados
            if ((this.snZerarPesquisaSelecionar) && (!this.mixinIsEmpty(arrSelecionado)) && (this.sn_pesquisou_registros)) {
                this.cancelarRegistrosEncontrados();
            }
        },

        async carregarRegistrosPressEnter(event) {
            let ds_buscar = event.target.value;
            if (this.mixinIsEmpty(ds_buscar)) {
                return false;
            }

            this.sn_carregando_registros = true;
            let sn_encotrou_tag = await this.carregarRegistrosDsBuscar(ds_buscar);
            this.sn_carregando_registros = false;

            // verifica se deve cadastrar a tag não encontrada
            if (!sn_encotrou_tag) {
                if (this.snHabilitarCadastro) {
                    this.cadastrarTagNaoEncontrada(ds_buscar);
                    return true;
                }

                let tituloAviso = $('#mensagensSelectTag').attr('data-attr-msg-aviso');
                let ds_aviso = $('#mensagensSelectTag').attr('data-attr-msg-nenhum-registro-encontrado');
                this.mixinAlertErro(tituloAviso, ds_aviso);
            }
        },

        async carregarRegistrosDsBuscar(ds_buscar) {
            if (this.mixinIsEmpty(ds_buscar)) {
                return false;
            }

            this.sn_pesquisou_registros = true;
            let sn_encotrou_tag = await this.getRequisicao({
                ds_search: ds_buscar
            });

            return sn_encotrou_tag;
        },

        cancelarRegistrosEncontrados() {
            this.arrOptions = [];
        },

        abrirModalGerenciamento() {
            this.getRegistrosPaginacaoGerenciar();

            $(`#${this.getIdModalGerenciamentoRegistros}`).appendTo("body");
            $(`#${this.getIdModalGerenciamentoRegistros}`).modal('show');

            // Checa se o componente está sendo aberto dentro de outra modal
            if ($('.modal.in').length > 0) {
                this.objModalAnterior = $('.modal.in');
                $(this.objModalAnterior).css('z-index', 1030);
            }
        },

        fecharModalGerenciamento() {
            $(`#${this.getIdModalGerenciamentoRegistros}`).modal('hide');

            // Checa se o componente está aberto dentro de outra modal
            if (this.objModalAnterior !== null) {
                $(this.objModalAnterior).css('z-index', 10000);
            }
        },

        async cadastrarTagNaoEncontrada(ds_tag) {
            this.sn_cadastrando_registro = true;

            let sn_cadastrar = await this.confirmarCadastroNovaTag();
            if (sn_cadastrar) {
                this.arrOptions = [];

                let sn_cadastrou = await this.salvarRegistro({
                    ds_descricao: ds_tag
                });

                if (sn_cadastrou) {
                    await this.carregarRegistrosDsBuscar(ds_tag);
                    this.sn_cadastrando_registro = false;
                    return true;
                }
            }

            this.sn_cadastrando_registro = false;
        },

        confirmarCadastroNovaTag() {
            let ds_titulo = $('#mensagensSelectTag').attr('data-attr-titulo-cadastrar-tag');
            let ds_texto = $('#mensagensSelectTag').attr('data-attr-msg-cadastrar-tag');
            let ds_confirmar = $('#mensagensSelectTag').attr('data-attr-btn-confirmar');
            let ds_cancelar = $('#mensagensSelectTag').attr('data-attr-btn-cancelar');

            return this.mixinAlertProsseguirOperacaoPersonalizado(
                ds_titulo,
                ds_texto,
                ds_confirmar,
                ds_cancelar
            );
        },

        confirmarExclusaoRegistro() {
            let ds_titulo = $('#mensagensSelectTag').attr('data-attr-titulo-excluir-tag');
            let ds_texto = $('#mensagensSelectTag').attr('data-attr-msg-excluir-tag');
            let ds_confirmar = $('#mensagensSelectTag').attr('data-attr-btn-confirmar');
            let ds_cancelar = $('#mensagensSelectTag').attr('data-attr-btn-cancelar');

            return this.mixinAlertProsseguirOperacaoPersonalizado(
                ds_titulo,
                ds_texto,
                ds_confirmar,
                ds_cancelar
            );
        },

        async salvarRegistro(objRegistro) {

            let objResponse = await axios.post(
                this.getCaminhoGravarInformacoes,
                objRegistro
            );

            let tituloAviso = $('#mensagensSelectTag').attr('data-attr-msg-aviso');
            if ((!this.mixinIsEmpty(objResponse)) && (objResponse.data.sn_status == true)) {
                let ds_aviso = $('#mensagensSelectTag').attr('data-attr-msg-cadastro-sucesso');
                this.mixinAlertSucesso(tituloAviso, ds_aviso);
                return true;
            }

            if (!this.mixinIsEmpty(objResponse.data.ds_erro)) {
                this.mixinAlertErro(tituloAviso, objResponse.data.ds_erro);
                return false;
            }

            let ds_aviso = $('#mensagensSelectTag').attr('data-attr-msg-cadastro-erro');
            this.mixinAlertErro(tituloAviso, ds_aviso);
            return false;
        },

        async removerRegistroBase(cd_registro) {

            let objResponse = await axios.post(
                this.getCaminhoRemoverRegistro,
                {
                    cd_registro: cd_registro
                }
            );

            let tituloAviso = $('#mensagensSelectTag').attr('data-attr-msg-aviso');
            if ((!this.mixinIsEmpty(objResponse)) && (objResponse.data.sn_status == true)) {
                let ds_aviso = $('#mensagensSelectTag').attr('data-attr-msg-remover-sucesso');
                this.mixinAlertSucesso(tituloAviso, ds_aviso);
                return true;
            }

            if (!this.mixinIsEmpty(objResponse.data.ds_erro)) {
                this.mixinAlertErro(tituloAviso, objResponse.data.ds_erro);
                return false;
            }

            let ds_aviso = $('#mensagensSelectTag').attr('data-attr-msg-remover-erro');
            this.mixinAlertErro(tituloAviso, ds_aviso);
            return false;
        },

        async getRegistrosPaginacaoGerenciar() {
            let objFiltro = {
                //ds_buscar: this.ds_buscar
            };

            this.sn_carregando_gerenciar = true;
            objFiltro = this.mixinGetFiltrosComPaginacao(objFiltro);

            let objResponse = await axios.post(
                this.getCaminhoCarregarInformacoes,
                objFiltro
            );

            // define a quanidade de paginas para o <uni-paginacao>
            this.mixinSetArrPaginacao(objResponse.data.arrPaginacao);

            if (objResponse.data.arrRegistros == undefined) {
                this.arrGerenciar = objResponse.data;
            } else {
                this.arrGerenciar = objResponse.data.arrRegistros;
            }

            this.sn_carregando_gerenciar = false;
        },

        filtrosPaginacaoGerenciar(nr_pagina, nr_registros_por_pagina) {
            this.mixinIrParaPagina(nr_pagina, nr_registros_por_pagina);
            this.getRegistrosPaginacaoGerenciar();
        },

        async adicionarNovoRegistro() {
            let sn_adicionou = await this.salvarRegistro({
                ds_descricao: this.ds_cadastrar
            });

            if (sn_adicionou) {
                this.cancelarAlteracaoRegistro();
                this.getRegistrosPaginacaoGerenciar();
                this.carregarOpcoesPadrao(this.snSearch);
            }
        },

        async salvarAlteracaoRegistro() {
            let sn_salvou = await this.salvarRegistro({
                cd_registro: this.cd_editar,
                ds_descricao: this.ds_cadastrar
            });

            if (sn_salvou) {
                this.atualizarOpcaoSelecionada(this.cd_editar, this.ds_cadastrar);
                this.cancelarAlteracaoRegistro();
                this.getRegistrosPaginacaoGerenciar();
                this.carregarOpcoesPadrao(this.snSearch);
            }
        },

        cancelarAlteracaoRegistro() {
            this.cd_editar = null;
            this.ds_cadastrar = null;
        },

        editarRegistro(index) {
            this.cd_editar = this.arrGerenciar[index][this.dsChave];
            this.ds_cadastrar = this.arrGerenciar[index][this.dsNome];
        },

        async removerRegistro(index) {
            if (await this.confirmarExclusaoRegistro()) {
                let cd_registro = this.arrGerenciar[index][this.dsChave];
                let sn_removeu = await this.removerRegistroBase(cd_registro);

                if (sn_removeu) {
                    this.removerOpcaoSelecionada(cd_registro);
                    this.getRegistrosPaginacaoGerenciar();
                    this.carregarOpcoesPadrao(this.snSearch);
                }
            }
        },

        removerOpcaoSelecionada(cd_registro) {
            let arrCdRegistrosModel = this.getArrCdRegistrosModel();
            if (this.mixinIsEmpty(arrCdRegistrosModel)) {
                return true;
            }

            let indexOpcao = arrCdRegistrosModel.indexOf(cd_registro);
            if (indexOpcao >= 0) {
                if (this.multiple) {
                    this.modelTag.splice(indexOpcao, 1);
                    return true;
                }

                this.modelTag = null;
            }
        },

        atualizarOpcaoSelecionada(cd_registro, ds_descricao) {
            let arrCdRegistrosModel = this.getArrCdRegistrosModel();
            if (this.mixinIsEmpty(arrCdRegistrosModel)) {
                return true;
            }

            let indexOpcao = arrCdRegistrosModel.indexOf(cd_registro);
            if (indexOpcao >= 0) {
                if (this.multiple) {
                    this.modelTag[indexOpcao][this.dsNome] = ds_descricao;
                    return true;
                }

                this.modelTag[this.dsNome] = ds_descricao;
            }
        },

        async selecionarValorPadrao() {
            await this.getOptions();

            //garante que está habilitado para alterar o model
            let sn_disabled = this.disabled;
            if (this.disabled) {
                this.disabled = false
            }

            this.modelTag = null;
            if (this.arrOptions.length > 0) {
                let modelAux = null;
                if (this.multiple) {
                    modelAux = this.arrOptions;
                } else {
                    modelAux = this.arrOptions[0];
                }

                this.modelTag = modelAux;
                this.disabled = sn_disabled;

                //emit um evento para identificar se o model foi alterado pelo componente
                this.$emit('input-model', this.modelTag);

                //limpa os array para facilitar a pesquisa de outros registros
                this.cancelarRegistrosEncontrados();
                return true;
            }

            this.modelTag = null;
            this.disabled = sn_disabled;
            this.$emit('input-model', this.modelTag);
        },

        //função executada ao setar o foco no componente
        async carregarOpcoesPadrao(sn_forcar = false) {
            if (this.sn_cadastrando_registro || this.sn_carregando_registros) {
                return false;
            }

            if (sn_forcar ||
                ((this.snSearch == true) &&
                    ((!this.sn_carregou_registros_padrao) || this.snCarregarOpcoesPadrao()
                ))
            ) {
                this.sn_carregando_registros = true;
                try {
                    this.sn_carregou_registros_padrao = true;

                    this.cancelarRegistrosEncontrados();
                    await this.getRequisicao();

                    this.sn_carregando_registros = false;
                } catch (objResponseError) {
                    console.error('Erro ao carregar dados no componente <select-tag>');
                    this.sn_carregando_registros = false;
                }
            }
        },

        async carregarTodasOpcoes() {
            if (this.sn_carregando_registros) {
                return false;
            }

            this.sn_carregando_registros = true;
            try {
                this.sn_carregou_registros_padrao = true;

                this.cancelarRegistrosEncontrados();

                // força carregar as opções sem limit
                let nrLimitCarregar = this.nrLimitCarregar;
                this.nrLimitCarregar = 0;

                await this.getRequisicao();
                this.nrLimitCarregar = nrLimitCarregar;

                this.sn_carregando_registros = false;
            } catch (objResponseError) {
                console.error('Erro ao carregar dados no componente <select-tag>');
                this.sn_carregando_registros = false;
            }
        },

        snCarregarOpcoesPadrao() {
            //verifica se já pesquisou registro e a lista estiver zerada ou todas opções já seleciondas
            if (this.sn_pesquisou_registros) {
                if (this.arrOptions.length == 0) {
                    return true;
                }

                //verifica se todas opções já estão selecionadas
                if (!this.mixinIsEmpty(this.modelTag)) {
                    let arrCdRegistrosModel = this.getArrCdRegistrosModel();

                    let sn_todos_selecionados = true;
                    this.arrOptions.forEach((objOption) => {
                        if (arrCdRegistrosModel.indexOf(objOption[this.dsChave]) < 0) {
                            sn_todos_selecionados = false;
                            return sn_todos_selecionados;
                        }
                    });

                    return sn_todos_selecionados;
                }
            }

            return false;
        },
    },

    created() {
        this.modelTag = this.modelTagProp;
        this.id = this._uid;
    },

    mounted() {
        // carrega registros iniciais
        if (
            //this.snSearch && ((this.nrLimitCarregar > 0) ||
            (!this.mixinIsEmpty(this.modelTag))
            // )
        ) {
            this.getOptions();
        }
    },

    watch: {
        filtroRegistro() {
            // carrega o(s) registro(s) informado(s) no filtro
            if (!this.mixinIsEmpty(this.filtroRegistro)) {
                this.selecionarValorPadrao();
                this.sn_carregou_registros_padrao = true;
                return true;
            }

            //se instanciar com filtro = null, zera os controles para
            //carregar as opções com "carregarOpcoesPadrao()"
            this.modelTag = null;
            this.cancelarRegistrosEncontrados();
            this.sn_carregou_registros_padrao = false;
            this.sn_pesquisou_registros = false;
        },

        //para forçar atualização quando campo é afetado pela seleção de outro
        //os filtros adicionais devem ser implementados na função getFiltros() em callback
        filtroAdicional() {
            this.cancelarRegistrosEncontrados();
            this.sn_carregou_registros_padrao = false;
            this.sn_pesquisou_registros = false;
        },

        modelTagProp() {
            this.modelTag = this.modelTagProp;
        },

        sn_carregando_registros() {
            // atualização em callback do loader
            this.onLoading(this.sn_carregando_registros);
        }
    },

    template: '#select-tag'
});
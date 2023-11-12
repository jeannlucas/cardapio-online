$(document).ready(function() {
    cardapio.eventos.init();

})

var cardapio = {};

var MEU_CARRINHO = [];

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
    }
}

cardapio.metodos = {

    //Lista de itens 
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        var filtro = MENU[categoria];
        console.log(filtro);

        if (!vermais){
            $("#itensCardapio").html('')
            $("#btnVerMais").removeClass('hidden');
        }

        $.each(filtro, (i,e) => {

            let temp = cardapio.templates.item
            .replace(/\${img}/g, e.img)
            .replace(/\${nome}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.',','))
            .replace(/\${id}/g, e.id)

            //botão ver mais clicado 12 itens
            if (vermais && i >= 8 && i < 12){
                $("#itensCardapio").append(temp)
            }

            //paginação inicial (8 itens) 
            if (!vermais && i < 8) {
                $("#itensCardapio").append(temp)
            }

        })

        // Remove ativo
        $(".container-menu a").removeClass('active');

        // Seta menu para ativo
        $("#menu-" + categoria).addClass('active')

    },

    //clique botão vermais
    verMais: () => {
        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1]; //menu-burgers
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');
    },

    //diminuir qtde do item no cardápio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }
    },

    //aumentar qtde do item no cardápios
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)

    },

    // adicionar item no carrinho 
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0 ) {
            
            // categoria ativa 
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1]; //menu-burgers

            // obter lista de itens
            let filtro = MENU[categoria];

            // obter o item 
            let item = $.grep(filtro, (e,i) => {return e.id == id});

            if (item.length > 0) {

                //validar item existe no carrinho 
                let existe = $.grep(MEU_CARRINHO, (elem,index) => {return elem.id == id});

                // se existir o item , só altera a qtde
                if (existe.length > 0){
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }

                // se não existir , adiciona ele
                else {
                    item[0].qntd = qntdAtual; 
                    MEU_CARRINHO.push(item[0])
                }

                $("#qntd-" + id).text(0)

            }

        }
        
    },

}

cardapio.templates = {
    item: `
        <div class="col-3 mb-5">
        <div class="card card-item \${id}">
            <div class="img-produto">
                <img
                    src="\${img}"/>
            </div>
            <p class="title-produto text-center mt-4">
                <b>\${nome}</b>
            </p>
            <p class="price-produto text-center">
                <b>R$\${preco}</b>
            </p>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-\${id}">0</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
            </div>
        </div>
    </div>
    ` 

}


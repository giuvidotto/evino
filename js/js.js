var JS = JS || {};

$(document).ready(function(){
	JS.Common = new Common();
});

Common = function(){
	this.init();
}

Common.prototype = {
	init:function(){
		this.documentReady();
	},
	
	documentReady: function(){
		// Variáveis
		this.criaVar();
		
		// Preparação
		this.etapaTudo.hide();
		this.divCronometro.hide();
		
		// Etapa: Início
		this.etapaInicio.fadeIn(200);
		this.botaoInicio.click(function(){
			JS.Common.etapaInicio.fadeOut(200);
			JS.Common.divCronometro.fadeIn(200);
			JS.Common.loadPergunta();
		});
		
	},
	
	criaVar:function(){
		//Pizza
		this.$pizza = $(".pizza");
		this.$pizzaItem = this.$pizza.find(".item");
		this.rotationSlice = 6;
		this.pizzaArray = [1, 1, 1, 1, 1, 1, 1, 1]; /*1=tem pizza / 0=ñ tem*/
		this.pizzaDisponivel = 8;
		this.pizzaAtual = 6;
		this.pizzaSorteada = 0;
		this.rotacaoAtual = 0;
		this.tl = new TimelineMax();
		
		//Interação
		this.loader = $("#loader");
		this.$divMain = $("#divMain");
		this.etapaTudo = this.loader.find(".etapa");
		this.etapaInicio = this.loader.find(".inicio");
		this.etapaPergunta = this.loader.find(".pergunta");
		this.etapaFinal = this.loader.find(".final");
		this.botaoInicio = this.etapaInicio.find(".button");
		this.divCronometro = $("#divCronometro");
		this.divPizza = $("#divPizza");
		this.$txtCronometro = $("#txtCronometro");
		this.interval = null;
		this.tempoLimite = 60;
		this.count = this.tempoLimite;
		
		//Perguntas
		this.$pergunta = $(".pergunta");
		this.$perguntaTxt = this.$pergunta.find("p");
		this.$perguntaLista = this.$pergunta.find(".resposta");
		this.$perguntaButton = this.$pergunta.find(".button");
		this.perguntaEscolhida = null;
		this.perguntaEscolhidaLista = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
		this.perguntaArray = {
			pergunta: [
				/*1*/	"A clássica pizza de <span>muçarela</span> se caracteriza pela sua simplicidade. Por isso, a melhor pedida são vinhos tintos jovens, leves e com boa acidez. Ou seja:",
				/*2*/	"A pizza de <span>pepperoni</span> é caracterizada pela picância. Sabendo que ela costuma ofuscar vinhos com pouca estrutura aromática, um Carménère é melhor escolha que um branco simples. Verdadeiro ou falso?",
				/*3*/	"Harmonização por congruência é aquela que busca características similares no alimento e na bebida. Para uma pizza de <span>cogumelos</span>, em que predomina o caráter terroso do vegetal, o vinho ideal é um:",
				/*4*/	"A pizza de <span>calabresa</span> é sempre uma pedida certa. Em virtude da presença da carne de porco, que é gordurosa e salgada, precisaremos de um vinho:",
				/*5*/	"Se quisermos um vinho naturalmente macio, que entre em harmonização por congruência com a untuosidade da pizza de <span>quatro queijos</span>, escolheremos um:",
				/*6*/	"Na pizza <span>margherita</span>, o ingrediente que mais chama a atenção do nosso olfato é o manjericão. Um vinho que tem aromas herbáceos e, portanto, harmoniza bem com este sabor é um:",
				/*7*/	"Sabendo que o sabor umami dos vegetais não harmoniza com vinhos com alta presença de taninos, uma pizza de <span>palmito ou abobrinha</span>, por exemplo, não irá bem com um tinto encorpado. Verdadeiro ou falso?",
				/*8*/	"Para uma pizza de <span>chocolate</span>, não tem dúvida. A escolha certeira é:"
			],
			resposta: [
				/*1*/	["com pouca (ou sem) passagem por barricas de carvalho.",
				"com longa passagem por barricas de carvalho."],
				
				/*2*/	["Verdadeiro.",
				"Falso."],
				
				/*3*/	["Pinot Noir.",
				"Bordeaux Blanc."],
				
				/*4*/	["branco e suave, para não ‘brigar’ com o ingrediente.",
				"de boa acidez e com taninos marcantes, para que não seja ofuscado."],
				
				/*5*/	["Espumante de Shiraz.",
				"Chardonnay com envelhecimento em barricas."],
				
				/*6*/	["Sauvignon Blanc.",
				"Late Harvest (de colheita tardia)."],
				
				/*7*/	["Verdadeiro.",
				"Falso."],
				
				/*8*/	["Um fortificado Vinho do Porto, desde que o chocolate da pizza seja amargo.",
				"Nenhuma. Pizzas doces e vinhos não combinam."]
			],
			correta: [
				/*1*/	0,
				/*2*/	0,
				/*3*/	0,
				/*4*/	1,
				/*5*/	1,
				/*6*/	0,
				/*7*/	0,
				/*8*/	0
			]
		};
		
		//Final
		this.finalResultado = {
			cupom: [
				"Evino-Pizza-10",
				"Pizza-Evino-15",
				"Pizza-20-Evino"
			],
			desconto: [
				"R$10",
				"R$15",
				"R$20"
			]
		};
		this.finalCorreta = 0;
		this.txtDesconto = $("#txtDesconto");
		this.txtCupom = $("#txtCupom");
		this.btnUsar = $("#btnUsar");
		this.btnCopiar = $("#btnCopiar");
		this.finalCupom = "";
		this.finalDesconto = "";
		this.linkTrack = $("#linkTrack");
		
	},
	
	giraPizza:function(){
		this.pizzaSorteada = this.pizzaRandom();
		while((this.pizzaArray[this.pizzaSorteada]==0) || ((Math.abs(this.pizzaSorteada-this.pizzaAtual)<=1) && (this.pizzaDisponivel>2))) {
			this.pizzaSorteada = this.pizzaRandom();
		}
		this.rotacaoAtual = this.animacaoGira();
		this.pizzaArray[this.pizzaSorteada]=0;
		this.pizzaAtual=this.pizzaSorteada;
		this.pizzaDisponivel--;
	},
	
	animacaoGira:function(){
		var rotacao = this.rotacaoAtual + 360 + (this.pizzaAtual - this.pizzaSorteada)*45;
		this.tl.to(this.$pizza, 2.5, {rotation:rotacao, ease:Power4.easeInOut});
		this.tl.to(this.$pizzaItem.eq(this.pizzaSorteada), 1, {top:"-=100px", ease:Power2.easeInOut, onComplete:function(){
			JS.Common.giraPizzaCallback();
		}});
		return rotacao;
	},
	
	animacaoTira:function(){
		this.tl.to(this.$pizzaItem.eq(this.pizzaSorteada), .5, {delay:.5, opacity:0, top:"-=20px", onComplete:function(){
			JS.Common.tiraPizzaCallback();
		}});
	},
	
	pizzaRandom:function(){
		return Math.floor(Math.random()*8);
	},
	
	cronometro:function(){
		if (JS.Common.count > 0) {
			JS.Common.count--;
			JS.Common.$txtCronometro.text(JS.Common.count);
		}else{
			JS.Common.$perguntaButton.trigger("click");
		}
	},
	
	$perguntaItem:function(num, texto){
		return '<li class="item"><span class="radio" data-resposta="'+num+'"></span><span class="txt">'+texto+'</span></li>';
	},
	
	perguntaRadio:function(){
		var resposta = $(".radio");
		
		resposta.click(function(){
			if($(this).hasClass("selected")){
				resposta.each(function(){
					$(this).removeClass("selected");
				});
			}else{
				resposta.each(function(){
					$(this).removeClass("selected");
				});
				$(this).addClass("selected");
			}
		});
	},
	
	perguntaResponder:function(num){
		JS.Common.$perguntaButton.off('click');
		clearInterval(JS.Common.interval);
		JS.Common.perguntaEscolhida = JS.Common.$perguntaLista.find(".radio.selected").attr("data-resposta");
		JS.Common.perguntaEscolhidaLista[num] = JS.Common.perguntaEscolhida;
		JS.Common.perguntaCorrigir();
		JS.Common.animacaoTira();
	},
	
	perguntaCorrigir:function(){
		var $certa = JS.Common.$perguntaLista.find(".radio[data-resposta='"+JS.Common.perguntaArray.correta[JS.Common.pizzaAtual]+"']").parent();
		var $outras = JS.Common.$perguntaLista.find(".item").not($certa);
		
		JS.Common.tl.to($certa.find(".radio"), 0, {className:"+=correta"});
		JS.Common.tl.to($certa, .2, {scale:1.03});
		JS.Common.tl.to($certa.find(".txt"), .2, {color:"#ffae00"});
		JS.Common.tl.to($outras, .2, {opacity:.3});
	},
	
	loadPergunta:function(){
		//JS.Common.tl.to($(window), 1, {scrollTo:JS.Common.$divMain, ease:Power2.easeOut});
		JS.Common.giraPizza();
	},
	
	giraPizzaCallback:function(){
		JS.Common.etapaPergunta.fadeOut(200, function(){
			JS.Common.$perguntaTxt.html(
				JS.Common.perguntaArray.pergunta[JS.Common.pizzaAtual]
			);
			$('.radio').off('click');
			JS.Common.$perguntaLista.html("");
			for(i=0;i<JS.Common.perguntaArray.resposta[JS.Common.pizzaAtual].length;i++){
				JS.Common.$perguntaLista.append(
					JS.Common.$perguntaItem(i, JS.Common.perguntaArray.resposta[JS.Common.pizzaAtual][i])
				)
			}
			JS.Common.perguntaRadio();
			JS.Common.$perguntaButton.click(function(){
				JS.Common.perguntaResponder(JS.Common.pizzaAtual);
			});
			JS.Common.count = JS.Common.tempoLimite+1;
			JS.Common.cronometro();
			JS.Common.interval = setInterval(function(){JS.Common.cronometro()}, 1000);
			JS.Common.etapaPergunta.fadeIn(200);
		});
	},
	
	tiraPizzaCallback:function(){
		if(JS.Common.pizzaDisponivel>0){
			JS.Common.loadPergunta();
		}else{
			JS.Common.loadFinal();
		}
	},
	
	geraResultado:function(){
		JS.Common.finalCorreta = 0;
		for(i=0;i<8;i++){
			if(JS.Common.perguntaArray.correta[i] == JS.Common.perguntaEscolhidaLista[i]){
				JS.Common.finalCorreta++;
			}
		}
		switch(JS.Common.finalCorreta){
			case 8:
				JS.Common.finalDesconto = JS.Common.finalResultado.desconto[2];
				JS.Common.finalCupom = JS.Common.finalResultado.cupom[2];
				break;
			case 7:
			case 6:
				JS.Common.finalDesconto = JS.Common.finalResultado.desconto[1];
				JS.Common.finalCupom = JS.Common.finalResultado.cupom[1];
				break;
			case 5:
			case 4:
			case 3:
			case 2:
			case 1:
				JS.Common.finalDesconto = JS.Common.finalResultado.desconto[0];
				JS.Common.finalCupom = JS.Common.finalResultado.cupom[0];
				break;
			default:
				window.location.href = "http://www.evino.com.br/diadapizza-tente-novamente";
				break;
		}
	},
	
	loadFinal:function(){
		JS.Common.divCronometro.fadeOut(200);
		JS.Common.divPizza.fadeOut(200);
		JS.Common.geraResultado();
		JS.Common.etapaPergunta.fadeOut({duration:200, complete:function(){
			JS.Common.txtDesconto.html(JS.Common.finalDesconto);
			JS.Common.txtCupom.html(JS.Common.finalCupom);
			JS.Common.btnUsar.attr("href", "http://www.evino.com.br/diadapizzaevino?couponCode="+JS.Common.finalCupom+"&utm_source=Newsletter&utm_medium=Email&utm_campaign=20160708.DiadaPizza&utm_content=Hotsite");
			JS.Common.btnCopiar.click(function(){
				//window.getSelection().addRange(JS.Common.finalCupom);
			});
			var numTrack = JS.Common.finalDesconto.replace("R$", "");
			JS.Common.linkTrack.attr("onClick", "_gaq.push([‘_trackEvent’, ‘quiz’, ‘resultado’, ‘desconto’, "+parseInt(numTrack)+", true]);");
			JS.Common.linkTrack.trigger("click");
			JS.Common.etapaFinal.fadeIn(200);
		}});
	}
}
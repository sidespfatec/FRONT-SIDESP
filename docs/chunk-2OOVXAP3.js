import{a as Fe,b as Ie}from"./chunk-CKUUPXD7.js";import{a as Ee,b as Te}from"./chunk-VK4NVKP2.js";import{a as ke,b as Se}from"./chunk-P2L2LWZN.js";import{a as ce,b as pe}from"./chunk-2NY5MNLS.js";import{a as Pe,b as Oe}from"./chunk-CN54ZZF2.js";import{a as Ne,b as Ae}from"./chunk-XSPJ37HK.js";import{a as Me}from"./chunk-VLZ6OWBZ.js";import{a as ge,b as ue,c as C,e as he,f as fe,i as _e,k as ve,l as Ce,q as be,s as we,u as ye,v as xe}from"./chunk-XJLRYRKV.js";import{$a as E,$b as ee,$d as N,Ab as g,Ac as ie,Bb as p,De as se,Eb as W,Ee as me,Fb as U,Gb as T,Hb as P,Ja as d,K as z,L,M as R,O as G,Ob as J,Pb as M,Q as w,Qb as r,Qc as ne,Rb as O,Sc as oe,W as _,Wa as S,Wb as K,X as v,Xa as H,Xb as X,Yb as Y,Za as $,Zb as Z,_a as q,ae as A,ba as f,fb as y,ib as u,ja as j,jb as h,ka as I,ke as ae,mb as V,me as le,nb as D,ob as s,oe as k,pb as a,pe as re,qb as o,qc as te,rb as m,ue as de,xb as Q,yb as x,zc as B}from"./chunk-EWQMONHR.js";var Ve=`
    .p-toggleswitch {
        display: inline-block;
        width: dt('toggleswitch.width');
        height: dt('toggleswitch.height');
    }

    .p-toggleswitch-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border-radius: dt('toggleswitch.border.radius');
    }

    .p-toggleswitch-slider {
        cursor: pointer;
        width: 100%;
        height: 100%;
        border-width: dt('toggleswitch.border.width');
        border-style: solid;
        border-color: dt('toggleswitch.border.color');
        background: dt('toggleswitch.background');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            border-color dt('toggleswitch.transition.duration'),
            outline-color dt('toggleswitch.transition.duration'),
            box-shadow dt('toggleswitch.transition.duration');
        border-radius: dt('toggleswitch.border.radius');
        outline-color: transparent;
        box-shadow: dt('toggleswitch.shadow');
    }

    .p-toggleswitch-handle {
        position: absolute;
        top: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: dt('toggleswitch.handle.background');
        color: dt('toggleswitch.handle.color');
        width: dt('toggleswitch.handle.size');
        height: dt('toggleswitch.handle.size');
        inset-inline-start: dt('toggleswitch.gap');
        margin-block-start: calc(-1 * calc(dt('toggleswitch.handle.size') / 2));
        border-radius: dt('toggleswitch.handle.border.radius');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            inset-inline-start dt('toggleswitch.slide.duration'),
            box-shadow dt('toggleswitch.slide.duration');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.background');
        border-color: dt('toggleswitch.checked.border.color');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.background');
        color: dt('toggleswitch.handle.checked.color');
        inset-inline-start: calc(dt('toggleswitch.width') - calc(dt('toggleswitch.handle.size') + dt('toggleswitch.gap')));
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-slider {
        background: dt('toggleswitch.hover.background');
        border-color: dt('toggleswitch.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.hover.background');
        color: dt('toggleswitch.handle.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.hover.background');
        border-color: dt('toggleswitch.checked.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.hover.background');
        color: dt('toggleswitch.handle.checked.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider {
        box-shadow: dt('toggleswitch.focus.ring.shadow');
        outline: dt('toggleswitch.focus.ring.width') dt('toggleswitch.focus.ring.style') dt('toggleswitch.focus.ring.color');
        outline-offset: dt('toggleswitch.focus.ring.offset');
    }

    .p-toggleswitch.p-invalid > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }

    .p-toggleswitch.p-disabled {
        opacity: 1;
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-slider {
        background: dt('toggleswitch.disabled.background');
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.disabled.background');
    }
`;var je=["handle"],He=["input"],$e=t=>({checked:t});function qe(t,i){t&1&&Q(0)}function Qe(t,i){if(t&1&&E(0,qe,1,0,"ng-container",3),t&2){let e=p();s("ngTemplateOutlet",e.handleTemplate||e._handleTemplate)("ngTemplateOutletContext",ee(2,$e,e.checked()))}}var We=`
    ${Ve}

    p-toggleswitch.ng-invalid.ng-dirty > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }
`,Ue={root:{position:"relative"}},Je={root:({instance:t})=>["p-toggleswitch p-component",{"p-toggleswitch p-component":!0,"p-toggleswitch-checked":t.checked(),"p-disabled":t.$disabled(),"p-invalid":t.invalid()}],input:"p-toggleswitch-input",slider:"p-toggleswitch-slider",handle:"p-toggleswitch-handle"},De=(()=>{class t extends ae{name="toggleswitch";style=We;classes=Je;inlineStyles=Ue;static \u0275fac=(()=>{let e;return function(n){return(e||(e=I(t)))(n||t)}})();static \u0275prov=L({token:t,factory:t.\u0275fac})}return t})();var Be=new G("TOGGLESWITCH_INSTANCE"),Ke={provide:ge,useExisting:z(()=>F),multi:!0},F=(()=>{class t extends Me{componentName="ToggleSwitch";$pcToggleSwitch=w(Be,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=w(k,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;tabindex;inputId;readonly;trueValue=!0;falseValue=!1;ariaLabel;size=te();ariaLabelledBy;autofocus;onChange=new f;input;handleTemplate;_handleTemplate;focused=!1;_componentStyle=w(De);templates;onHostClick(e){this.onClick(e)}onAfterContentInit(){this.templates.forEach(e=>{e.getType()==="handle"?this._handleTemplate=e.template:this._handleTemplate=e.template})}onClick(e){!this.$disabled()&&!this.readonly&&(this.writeModelValue(this.checked()?this.falseValue:this.trueValue),this.onModelChange(this.modelValue()),this.onChange.emit({originalEvent:e,checked:this.modelValue()}),this.input.nativeElement.focus())}onFocus(){this.focused=!0}onBlur(){this.focused=!1,this.onModelTouched()}checked(){return this.modelValue()===this.trueValue}writeControlValue(e,l){l(e),this.cd.markForCheck()}get dataP(){return this.cn({checked:this.checked(),disabled:this.$disabled(),invalid:this.invalid()})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=I(t)))(n||t)}})();static \u0275cmp=S({type:t,selectors:[["p-toggleswitch"],["p-toggleSwitch"],["p-toggle-switch"]],contentQueries:function(l,n,c){if(l&1&&W(c,je,4)(c,N,4),l&2){let b;T(b=P())&&(n.handleTemplate=b.first),T(b=P())&&(n.templates=b)}},viewQuery:function(l,n){if(l&1&&U(He,5),l&2){let c;T(c=P())&&(n.input=c.first)}},hostVars:7,hostBindings:function(l,n){l&1&&g("click",function(b){return n.onHostClick(b)}),l&2&&(y("data-p-checked",n.checked())("data-p-disabled",n.$disabled())("data-p",n.dataP),J(n.sx("root")),M(n.cn(n.cx("root"),n.styleClass)))},inputs:{styleClass:"styleClass",tabindex:[2,"tabindex","tabindex",ie],inputId:"inputId",readonly:[2,"readonly","readonly",B],trueValue:"trueValue",falseValue:"falseValue",ariaLabel:"ariaLabel",size:[1,"size"],ariaLabelledBy:"ariaLabelledBy",autofocus:[2,"autofocus","autofocus",B]},outputs:{onChange:"onChange"},features:[Z([Ke,De,{provide:Be,useExisting:t},{provide:le,useExisting:t}]),$([k]),q],decls:5,vars:22,consts:[["input",""],["type","checkbox","role","switch",3,"focus","blur","checked","pAutoFocus","pBind"],[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(l,n){l&1&&(a(0,"input",1,0),g("focus",function(){return n.onFocus()})("blur",function(){return n.onBlur()}),o(),a(2,"div",2)(3,"div",2),u(4,Qe,1,4,"ng-container"),o()()),l&2&&(M(n.cx("input")),s("checked",n.checked())("pAutoFocus",n.autofocus)("pBind",n.ptm("input")),y("id",n.inputId)("required",n.required()?"":void 0)("disabled",n.$disabled()?"":void 0)("aria-checked",n.checked())("aria-labelledby",n.ariaLabelledBy)("aria-label",n.ariaLabel)("name",n.name())("tabindex",n.tabindex),d(2),M(n.cx("slider")),s("pBind",n.ptm("slider")),y("data-p",n.dataP),d(),M(n.cx("handle")),s("pBind",n.ptm("handle")),y("data-p",n.dataP),d(),h(n.handleTemplate||n._handleTemplate?4:-1))},dependencies:[oe,ne,de,A,re,k],encapsulation:2,changeDetection:0})}return t})(),ze=(()=>{class t{static \u0275fac=function(l){return new(l||t)};static \u0275mod=H({type:t});static \u0275inj=R({imports:[F,A,A]})}return t})();var Le=[{label:"Administrador geral",value:"Administrador geral"},{label:"Administrador de unidade",value:"Administrador de unidade"},{label:"Operador",value:"Operador"},{label:"Somente leitura",value:"Somente leitura"}];var Ye=(t,i)=>i.titulo,Ze=(t,i)=>i.rotulo;function et(t,i){if(t&1&&(a(0,"div",9)(1,"dt"),r(2),o(),a(3,"dd"),r(4),o()()),t&2){let e=i.$implicit;d(2),O(e.rotulo),d(2),O(e.valor||"\u2014")}}function tt(t,i){if(t&1&&(a(0,"section",5)(1,"h2",7),r(2),o(),a(3,"dl",8),V(4,et,5,2,"div",9,Ze),o()()),t&2){let e=i.$implicit;d(2),O(e.titulo),d(2),D(e.itens)}}function it(t,i){if(t&1){let e=x();a(0,"div",1),m(1,"p-tag",4),V(2,tt,6,1,"section",5,Ye),a(4,"p-button",6),g("onClick",function(){_(e);let n=p();return v(n.desativar.emit())}),o()()}if(t&2){let e=p();d(),s("value",e.admin!=null&&e.admin.ativo?"Ativo":"Inativo")("severity",e.admin!=null&&e.admin.ativo?"success":"secondary"),d(),D(e.secoes),d(2),s("label",e.admin!=null&&e.admin.ativo?"Desativar acesso":"Reativar acesso")("icon",e.admin!=null&&e.admin.ativo?"pi pi-ban":"pi pi-check")("severity",e.admin!=null&&e.admin.ativo?"danger":"success")("text",!0)}}function nt(t,i){t&1&&(a(0,"small",13),r(1,"Informe o nome completo."),o())}function ot(t,i){t&1&&(a(0,"small",13),r(1,"Informe um e-mail v\xE1lido."),o())}function at(t,i){t&1&&(a(0,"small",13),r(1,"Escolha um n\xEDvel."),o())}function lt(t,i){t&1&&(a(0,"div",10)(1,"label",39),r(2,"Senha inicial"),o(),m(3,"p-password",40),a(4,"small",41),r(5,"A pessoa troca no primeiro acesso."),o()()),t&2&&(d(3),s("toggleMask",!0)("feedback",!1))}function rt(t,i){if(t&1){let e=x();a(0,"p-button",42),g("onClick",function(){_(e);let n=p(2);return v(n.redefinirSenha.emit())}),o()}t&2&&s("text",!0)}function dt(t,i){if(t&1&&(a(0,"form",2)(1,"h2",7),r(2,"Dados pessoais"),o(),a(3,"div",10)(4,"label",11),r(5,"Nome completo"),o(),m(6,"input",12),u(7,nt,2,0,"small",13),o(),a(8,"div",14)(9,"div",10)(10,"label",15),r(11,"CPF"),o(),m(12,"p-inputmask",16),o(),a(13,"div",10)(14,"label",17),r(15,"RG"),o(),m(16,"input",18),o()(),a(17,"div",10)(18,"label",19),r(19,"Data de nascimento"),o(),m(20,"p-datepicker",20),o(),a(21,"h2",7),r(22,"Contato"),o(),a(23,"div",10)(24,"label",21),r(25,"E-mail"),o(),m(26,"input",22),u(27,ot,2,0,"small",13),o(),a(28,"div",14)(29,"div",10)(30,"label",23),r(31,"Telefone"),o(),m(32,"p-inputmask",24),o(),a(33,"div",10)(34,"label",25),r(35,"Cidade"),o(),m(36,"input",26),o()(),a(37,"h2",7),r(38,"Acesso"),o(),a(39,"div",10)(40,"label",27),r(41,"N\xEDvel de permiss\xE3o"),o(),m(42,"p-select",28),u(43,at,2,0,"small",13),o(),a(44,"div",14)(45,"div",10)(46,"label",29),r(47,"Cargo"),o(),m(48,"input",30),o(),a(49,"div",10)(50,"label",31),r(51,"Unidade"),o(),m(52,"input",32),o()(),a(53,"div",10)(54,"label",33),r(55,"Data de admiss\xE3o"),o(),m(56,"p-datepicker",34),o(),u(57,lt,6,2,"div",10),a(58,"div",35),m(59,"p-toggleswitch",36),a(60,"label",37),r(61,"Exigir autentica\xE7\xE3o em dois fatores"),o()(),u(62,rt,1,1,"p-button",38),o()),t&2){let e=p();s("formGroup",e.form),d(7),h(e.invalido("nome")?7:-1),d(13),s("maxDate",e.hoje),d(7),h(e.invalido("email")?27:-1),d(15),s("options",e.niveis),d(),h(e.invalido("nivel")?43:-1),d(14),h(e.modo==="novo"?57:-1),d(5),h(e.modo==="editar"?62:-1)}}function st(t,i){if(t&1){let e=x();a(0,"p-button",43),g("onClick",function(){_(e);let n=p(2);return v(n.fechar())}),o(),a(1,"p-button",44),g("onClick",function(){_(e);let n=p(2);return v(n.editar.emit())}),o()}t&2&&s("text",!0)}function mt(t,i){if(t&1){let e=x();a(0,"p-button",45),g("onClick",function(){_(e);let n=p(2);return v(n.cancelar())}),o(),a(1,"p-button",46),g("onClick",function(){_(e);let n=p(2);return v(n.enviar())}),o()}if(t&2){let e=p(2);s("text",!0),d(),s("label",e.modo==="novo"?"Cadastrar":"Salvar")}}function ct(t,i){if(t&1&&u(0,st,2,1)(1,mt,2,2),t&2){let e=p();h(e.readOnly?0:1)}}var Re=class t{visible=!1;modo="ver";admin=null;visibleChange=new f;salvar=new f;editar=new f;desativar=new f;redefinirSenha=new f;fb=w(be);niveis=Le;hoje=new Date;form=this.fb.nonNullable.group({nome:["",[C.required,C.minLength(3)]],cpf:["",C.required],rg:[""],nascimento:[null],email:["",[C.required,C.email]],telefone:[""],cidade:[""],nivel:["",C.required],cargo:[""],unidade:[""],admissao:[null],senha:[""],doisFatores:[!0]});ngOnChanges(i){(i.admin||i.modo||i.visible)&&(this.modo==="novo"?this.limpar():this.preencher(this.admin))}get readOnly(){return this.modo==="ver"}get titulo(){return this.modo==="novo"?"Novo administrador":this.modo==="editar"?"Editar administrador":this.admin?.nome??"Administrador"}get secoes(){let i=this.admin;if(!i)return[];let e=l=>l?l.toLocaleDateString("pt-BR"):"";return[{titulo:"Dados pessoais",itens:[{rotulo:"CPF",valor:i.cpf},{rotulo:"RG",valor:i.rg},{rotulo:"Nascimento",valor:e(i.nascimento)}]},{titulo:"Contato",itens:[{rotulo:"E-mail",valor:i.email},{rotulo:"Telefone",valor:i.telefone},{rotulo:"Cidade",valor:i.cidade}]},{titulo:"Acesso",itens:[{rotulo:"N\xEDvel de permiss\xE3o",valor:i.nivel},{rotulo:"Cargo",valor:i.cargo},{rotulo:"Unidade",valor:i.unidade},{rotulo:"Admiss\xE3o",valor:e(i.admissao)},{rotulo:"Dois fatores",valor:i.doisFatores?"Exigida":"N\xE3o exigida"},{rotulo:"Cadastrado por",valor:i.cadastradoPor}]}]}invalido(i){let e=this.form.get(i);return!!e&&e.invalid&&(e.dirty||e.touched)}enviar(){if(this.form.invalid){this.form.markAllAsTouched();return}let i=this.form.getRawValue();this.salvar.emit({id:this.admin?.id??0,nome:i.nome,cpf:i.cpf,rg:i.rg,nascimento:i.nascimento,email:i.email,telefone:i.telefone,cidade:i.cidade,nivel:i.nivel,cargo:i.cargo,unidade:i.unidade,admissao:i.admissao,doisFatores:i.doisFatores,ativo:this.admin?.ativo??!0,cadastradoPor:this.admin?.cadastradoPor})}cancelar(){if(this.modo==="editar"&&this.admin){this.preencher(this.admin),this.modo="ver";return}this.fechar()}fechar(){this.visible=!1,this.visibleChange.emit(!1)}preencher(i){if(!i){this.limpar();return}this.form.reset({nome:i.nome,cpf:i.cpf,rg:i.rg??"",nascimento:i.nascimento,email:i.email,telefone:i.telefone,cidade:i.cidade,nivel:i.nivel,cargo:i.cargo,unidade:i.unidade,admissao:i.admissao,senha:"",doisFatores:i.doisFatores})}limpar(){this.form.reset({nome:"",cpf:"",rg:"",nascimento:null,email:"",telefone:"",cidade:"",nivel:"",cargo:"",unidade:"",admissao:null,senha:"",doisFatores:!0})}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=S({type:t,selectors:[["app-new-admin-modal"]],inputs:{visible:"visible",modo:"modo",admin:"admin"},outputs:{visibleChange:"visibleChange",salvar:"salvar",editar:"editar",desativar:"desativar",redefinirSenha:"redefinirSenha"},features:[j],decls:4,vars:6,consts:[["styleClass","admin-dialog",3,"visibleChange","visible","modal","draggable","resizable","header"],[1,"admin-detail"],[1,"admin-form",3,"formGroup"],["pTemplate","footer"],[3,"value","severity"],[1,"admin-detail-section"],[1,"admin-detail-action",3,"onClick","label","icon","severity","text"],[1,"admin-form-title"],[1,"admin-detail-list"],[1,"admin-detail-item"],[1,"admin-field"],["for","nome"],["id","nome","pInputText","","formControlName","nome"],[1,"admin-field-error"],[1,"admin-field-row"],["for","cpf"],["id","cpf","formControlName","cpf","mask","999.999.999-99"],["for","rg"],["id","rg","pInputText","","formControlName","rg"],["for","nascimento"],["id","nascimento","formControlName","nascimento","dateFormat","dd/mm/yy","appendTo","body",3,"maxDate"],["for","email"],["id","email","pInputText","","type","email","formControlName","email"],["for","telefone"],["id","telefone","formControlName","telefone","mask","(99) 99999-9999"],["for","cidade"],["id","cidade","pInputText","","formControlName","cidade"],["for","nivel"],["id","nivel","formControlName","nivel","optionLabel","label","optionValue","value","appendTo","body",3,"options"],["for","cargo"],["id","cargo","pInputText","","formControlName","cargo"],["for","unidade"],["id","unidade","pInputText","","formControlName","unidade"],["for","admissao"],["id","admissao","formControlName","admissao","dateFormat","dd/mm/yy","appendTo","body"],[1,"admin-field-switch"],["inputId","doisFatores","formControlName","doisFatores"],["for","doisFatores"],["label","Redefinir senha","icon","pi pi-key","severity","secondary",3,"text"],["for","senha"],["id","senha","formControlName","senha",3,"toggleMask","feedback"],[1,"admin-field-hint"],["label","Redefinir senha","icon","pi pi-key","severity","secondary",3,"onClick","text"],["label","Fechar","severity","secondary",3,"onClick","text"],["label","Editar","icon","pi pi-pencil",3,"onClick"],["label","Cancelar","severity","secondary",3,"onClick","text"],["icon","pi pi-check",3,"onClick","label"]],template:function(e,l){e&1&&(a(0,"p-dialog",0),Y("visibleChange",function(c){return X(l.visible,c)||(l.visible=c),c}),g("visibleChange",function(c){return l.visibleChange.emit(c)}),u(1,it,5,6,"div",1)(2,dt,63,8,"form",2),E(3,ct,2,1,"ng-template",3),o()),e&2&&(K("visible",l.visible),s("modal",!0)("draggable",!1)("resizable",!1)("header",l.titulo),d(),h(l.readOnly?1:2))},dependencies:[we,_e,ue,he,fe,Ce,ve,pe,ce,N,xe,ye,Se,ke,Ae,Ne,Oe,Pe,Te,Ee,ze,F,Ie,Fe,me,se],styles:["[_nghost-%COMP%]     .admin-dialog{width:100vw;height:100dvh;max-height:100dvh;margin:0;border:none;border-radius:0;background:#fff}@media(min-width:48em){[_nghost-%COMP%]     .admin-dialog{width:32rem;height:auto;max-height:90vh;border-radius:.75rem}}[_nghost-%COMP%]     .admin-dialog .p-dialog-header, [_nghost-%COMP%]     .admin-dialog .p-dialog-content, [_nghost-%COMP%]     .admin-dialog .p-dialog-footer{background:transparent;border:none;padding-inline:1.25rem}@media(min-width:48em){[_nghost-%COMP%]     .admin-dialog .p-dialog-header, [_nghost-%COMP%]     .admin-dialog .p-dialog-content, [_nghost-%COMP%]     .admin-dialog .p-dialog-footer{padding-inline:1.5rem}}[_nghost-%COMP%]     .admin-dialog .p-dialog-header{padding-block:1rem .5rem}[_nghost-%COMP%]     .admin-dialog .p-dialog-title{font-size:1.25rem;font-weight:600;color:var(--color-text-primary)}[_nghost-%COMP%]     .admin-dialog .p-dialog-content{padding-block:.5rem 1.5rem}[_nghost-%COMP%]     .admin-dialog .p-dialog-footer{display:flex;gap:.5rem;padding-block:.75rem 1rem;border-top:.0625rem solid var(--gray-300)}[_nghost-%COMP%]     .admin-dialog .p-dialog-footer>p-button{flex:1}[_nghost-%COMP%]     .admin-dialog .p-dialog-footer>p-button button{width:100%}@media(min-width:48em){[_nghost-%COMP%]     .admin-dialog .p-dialog-footer{justify-content:flex-end}[_nghost-%COMP%]     .admin-dialog .p-dialog-footer>p-button{flex:0 0 auto}[_nghost-%COMP%]     .admin-dialog .p-dialog-footer>p-button button{width:auto}}[_nghost-%COMP%]     .admin-form .p-inputtext, [_nghost-%COMP%]     .admin-form .p-select, [_nghost-%COMP%]     .admin-form .p-inputmask, [_nghost-%COMP%]     .admin-form .p-datepicker, [_nghost-%COMP%]     .admin-form .p-password, [_nghost-%COMP%]     .admin-form .p-password input{width:100%}.admin-form[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1rem}.admin-form-title[_ngcontent-%COMP%]{margin:.75rem 0 0;font-size:.8125rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--color-brand-primary)}.admin-form-title[_ngcontent-%COMP%]:first-child{margin-top:0}.admin-field[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.25rem;min-width:0}.admin-field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-size:.75rem;font-weight:500;color:var(--color-text-secondary)}.admin-field-row[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1rem}@media(min-width:40em){.admin-field-row[_ngcontent-%COMP%]{flex-direction:row}.admin-field-row[_ngcontent-%COMP%] > .admin-field[_ngcontent-%COMP%]{flex:1 1 0}}.admin-field-switch[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.625rem;font-size:.875rem;color:var(--color-text-primary)}.admin-field-hint[_ngcontent-%COMP%], .admin-field-error[_ngcontent-%COMP%]{margin:0;font-size:.75rem}.admin-field-hint[_ngcontent-%COMP%]{color:var(--color-text-muted)}.admin-field-error[_ngcontent-%COMP%]{color:var(--color-danger)}.admin-detail[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1.5rem}.admin-detail[_ngcontent-%COMP%] > p-tag[_ngcontent-%COMP%]{align-self:flex-start}.admin-detail-section[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.75rem}.admin-detail-section[_ngcontent-%COMP%]   .admin-form-title[_ngcontent-%COMP%]{margin:0}.admin-detail-list[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.875rem;margin:0}.admin-detail-item[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%]{font-size:.75rem;color:var(--color-text-secondary)}.admin-detail-item[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%]{margin:.125rem 0 0;font-size:1rem;font-weight:500;color:var(--color-text-primary);overflow-wrap:anywhere}.admin-detail-action[_ngcontent-%COMP%]{align-self:flex-start}"]})};export{Re as a};

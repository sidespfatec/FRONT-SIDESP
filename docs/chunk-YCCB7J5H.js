import{a as ae}from"./chunk-LFL2Z7A2.js";import{a as se}from"./chunk-EGJTO6ZO.js";import{a as ie,e as ne,h as le,n as oe}from"./chunk-CCMVJV7P.js";import{$a as y,$d as Z,Ab as q,Bb as u,Eb as P,Gb as _,Hb as C,Ja as L,K as E,L as T,M as S,Mc as W,O as w,Ob as Q,Oc as X,Q as c,W as B,Wa as V,Wd as Y,X as O,Xa as D,Xb as U,Xc as p,Xd as f,Yc as d,Za as M,_a as F,_b as H,ba as h,be as ee,de as m,ee as te,fb as N,hc as G,ib as A,jb as I,ka as g,mb as $,nb as k,ob as v,oc as x,pb as z,qb as K,wc as r,xb as R,xc as J,yb as j}from"./chunk-NTRQHUWK.js";var re=`
    .p-selectbutton {
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        outline-color: transparent;
        border-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton .p-togglebutton {
        border-radius: 0;
        border-width: 1px 1px 1px 0;
    }

    .p-selectbutton .p-togglebutton:focus-visible {
        position: relative;
        z-index: 1;
    }

    .p-selectbutton .p-togglebutton:first-child {
        border-inline-start-width: 1px;
        border-start-start-radius: dt('selectbutton.border.radius');
        border-end-start-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton .p-togglebutton:last-child {
        border-start-end-radius: dt('selectbutton.border.radius');
        border-end-end-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton.p-invalid {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }

    .p-selectbutton-fluid {
        width: 100%;
    }
    
    .p-selectbutton-fluid .p-togglebutton {
        flex: 1 1 0;
    }
`;var pe=["item"],fe=(i,s)=>({$implicit:i,index:s});function me(i,s){return this.getOptionLabel(s)}function be(i,s){i&1&&R(0)}function he(i,s){if(i&1&&y(0,be,1,0,"ng-container",3),i&2){let e=u(2),t=e.$implicit,n=e.$index,l=u();v("ngTemplateOutlet",l.itemTemplate||l._itemTemplate)("ngTemplateOutletContext",H(2,fe,t,n))}}function ge(i,s){i&1&&y(0,he,1,5,"ng-template",null,0,G)}function ye(i,s){if(i&1){let e=j();z(0,"p-togglebutton",2),q("onChange",function(n){let l=B(e),o=l.$implicit,a=l.$index,b=u();return O(b.onOptionSelect(n,o,a))}),A(1,ge,2,0),K()}if(i&2){let e=s.$implicit,t=u();v("autofocus",t.autofocus)("styleClass",t.styleClass)("ngModel",t.isSelected(e))("onLabel",t.getOptionLabel(e))("offLabel",t.getOptionLabel(e))("disabled",t.$disabled()||t.isOptionDisabled(e))("allowEmpty",t.getAllowEmpty())("size",t.size())("fluid",t.fluid())("pt",t.ptm("pcToggleButton"))("unstyled",t.unstyled()),L(),I(t.itemTemplate||t._itemTemplate?1:-1)}}var ve=`
    ${re}

    /* For PrimeNG */
    .p-selectbutton.ng-invalid.ng-dirty {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }
`,_e={root:({instance:i})=>["p-selectbutton p-component",{"p-invalid":i.invalid(),"p-selectbutton-fluid":i.fluid()}]},ue=(()=>{class i extends Z{name="selectbutton";style=ve;classes=_e;static \u0275fac=(()=>{let e;return function(n){return(e||(e=g(i)))(n||i)}})();static \u0275prov=T({token:i,factory:i.\u0275fac})}return i})();var de=new w("SELECTBUTTON_INSTANCE"),Ce={provide:ie,useExisting:E(()=>ce),multi:!0},ce=(()=>{class i extends se{componentName="SelectButton";options;optionLabel;optionValue;optionDisabled;get unselectable(){return this._unselectable}_unselectable=!1;set unselectable(e){this._unselectable=e,this.allowEmpty=!e}tabindex=0;multiple;allowEmpty=!0;styleClass;ariaLabelledBy;dataKey;autofocus;size=x();fluid=x(void 0,{transform:r});onOptionClick=new h;onChange=new h;itemTemplate;_itemTemplate;get equalityKey(){return this.optionValue?null:this.dataKey}value;focusedIndex=0;_componentStyle=c(ue);$pcSelectButton=c(de,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=c(m,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}getAllowEmpty(){return this.multiple?this.allowEmpty||this.value?.length!==1:this.allowEmpty}getOptionLabel(e){return this.optionLabel?p(e,this.optionLabel):e.label!=null?e.label:e}getOptionValue(e){return this.optionValue?p(e,this.optionValue):this.optionLabel||e.value===void 0?e:e.value}isOptionDisabled(e){return this.optionDisabled?p(e,this.optionDisabled):e.disabled!==void 0?e.disabled:!1}onOptionSelect(e,t,n){if(this.$disabled()||this.isOptionDisabled(t))return;let l=this.isSelected(t);if(l&&this.unselectable)return;let o=this.getOptionValue(t),a;if(this.multiple)l?a=this.value.filter(b=>!d(b,o,this.equalityKey||void 0)):a=this.value?[...this.value,o]:[o];else{if(l&&!this.allowEmpty)return;a=l?null:o}this.focusedIndex=n,this.value=a,this.writeModelValue(this.value),this.onModelChange(this.value),this.onChange.emit({originalEvent:e,value:this.value}),this.onOptionClick.emit({originalEvent:e,option:t,index:n})}changeTabIndexes(e,t){let n,l;for(let o=0;o<=this.el.nativeElement.children.length-1;o++)this.el.nativeElement.children[o].getAttribute("tabindex")==="0"&&(n={elem:this.el.nativeElement.children[o],index:o});t==="prev"?n.index===0?l=this.el.nativeElement.children.length-1:l=n.index-1:n.index===this.el.nativeElement.children.length-1?l=0:l=n.index+1,this.focusedIndex=l,this.el.nativeElement.children[l].focus()}onFocus(e,t){this.focusedIndex=t}onBlur(){this.onModelTouched()}removeOption(e){this.value=this.value.filter(t=>!d(t,this.getOptionValue(e),this.dataKey))}isSelected(e){let t=!1,n=this.getOptionValue(e);if(this.multiple){if(this.value&&Array.isArray(this.value)){for(let l of this.value)if(d(l,n,this.dataKey)){t=!0;break}}}else t=d(this.getOptionValue(e),this.value,this.equalityKey||void 0);return t}templates;onAfterContentInit(){this.templates.forEach(e=>{e.getType()==="item"&&(this._itemTemplate=e.template)})}writeControlValue(e,t){this.value=e,t(this.value),this.cd.markForCheck()}get dataP(){return this.cn({invalid:this.invalid()})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=g(i)))(n||i)}})();static \u0275cmp=V({type:i,selectors:[["p-selectButton"],["p-selectbutton"],["p-select-button"]],contentQueries:function(t,n,l){if(t&1&&P(l,pe,4)(l,Y,4),t&2){let o;_(o=C())&&(n.itemTemplate=o.first),_(o=C())&&(n.templates=o)}},hostVars:5,hostBindings:function(t,n){t&2&&(N("role","group")("aria-labelledby",n.ariaLabelledBy)("data-p",n.dataP),Q(n.cx("root")))},inputs:{options:"options",optionLabel:"optionLabel",optionValue:"optionValue",optionDisabled:"optionDisabled",unselectable:[2,"unselectable","unselectable",r],tabindex:[2,"tabindex","tabindex",J],multiple:[2,"multiple","multiple",r],allowEmpty:[2,"allowEmpty","allowEmpty",r],styleClass:"styleClass",ariaLabelledBy:"ariaLabelledBy",dataKey:"dataKey",autofocus:[2,"autofocus","autofocus",r],size:[1,"size"],fluid:[1,"fluid"]},outputs:{onOptionClick:"onOptionClick",onChange:"onChange"},features:[U([Ce,ue,{provide:de,useExisting:i},{provide:ee,useExisting:i}]),M([m]),F],decls:2,vars:0,consts:[["content",""],[3,"autofocus","styleClass","ngModel","onLabel","offLabel","disabled","allowEmpty","size","fluid","pt","unstyled"],[3,"onChange","autofocus","styleClass","ngModel","onLabel","offLabel","disabled","allowEmpty","size","fluid","pt","unstyled"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(t,n){t&1&&$(0,ye,2,12,"p-togglebutton",1,me,!0),t&2&&k(n.options)},dependencies:[ae,oe,ne,le,X,W,f,te],encapsulation:2,changeDetection:0})}return i})(),He=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=D({type:i});static \u0275inj=S({imports:[ce,f,f]})}return i})();export{ce as a,He as b};

import{l as I}from"./chunk-BXJCFKPO.js";import{$d as M,Cb as m,Db as g,L as s,M as p,O as c,Ob as v,Oc as y,Q as a,Wa as f,Xa as d,Xb as h,Xd as r,Za as b,_a as u,be as D,ce as F,de as l,ee as x,ka as o}from"./chunk-NTRQHUWK.js";var B=`
    .p-iftalabel {
        display: block;
        position: relative;
    }

    .p-iftalabel label {
        position: absolute;
        pointer-events: none;
        top: dt('iftalabel.top');
        transition-property: all;
        transition-timing-function: ease;
        line-height: 1;
        font-size: dt('iftalabel.font.size');
        font-weight: dt('iftalabel.font.weight');
        inset-inline-start: dt('iftalabel.position.x');
        color: dt('iftalabel.color');
        transition-duration: dt('iftalabel.transition.duration');
    }

    .p-iftalabel .p-inputtext,
    .p-iftalabel .p-textarea,
    .p-iftalabel .p-select-label,
    .p-iftalabel .p-multiselect-label,
    .p-iftalabel .p-multiselect-label:has(.p-chip),
    .p-iftalabel .p-autocomplete-input-multiple,
    .p-iftalabel .p-cascadeselect-label,
    .p-iftalabel .p-treeselect-label {
        padding-block-start: dt('iftalabel.input.padding.top');
        padding-block-end: dt('iftalabel.input.padding.bottom');
    }

    .p-iftalabel:has(.p-invalid) label {
        color: dt('iftalabel.invalid.color');
    }

    .p-iftalabel:has(input:focus) label,
    .p-iftalabel:has(input:-webkit-autofill) label,
    .p-iftalabel:has(textarea:focus) label,
    .p-iftalabel:has(.p-inputwrapper-focus) label {
        color: dt('iftalabel.focus.color');
    }

    .p-iftalabel .p-inputicon {
        top: dt('iftalabel.input.padding.top');
        transform: translateY(25%);
        margin-top: 0;
    }
`;var C=["*"],E=`
    ${B}

    /* For PrimeNG */
    .p-iftalabel:has(.ng-invalid.ng-dirty) label {
        color: dt('iftalabel.invalid.color');
    }
`,L={root:"p-iftalabel"},N=(()=>{class t extends M{name="iftalabel";style=E;classes=L;static \u0275fac=(()=>{let e;return function(i){return(e||(e=o(t)))(i||t)}})();static \u0275prov=s({token:t,factory:t.\u0275fac})}return t})();var A=new c("IFTALABEL_INSTANCE"),S=(()=>{class t extends F{componentName="IftaLabel";_componentStyle=a(N);$pcIftaLabel=a(A,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=a(l,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}static \u0275fac=(()=>{let e;return function(i){return(e||(e=o(t)))(i||t)}})();static \u0275cmp=f({type:t,selectors:[["p-iftalabel"],["p-iftaLabel"],["p-ifta-label"]],hostVars:2,hostBindings:function(n,i){n&2&&v(i.cx("root"))},features:[h([N,{provide:A,useExisting:t},{provide:D,useExisting:t}]),b([l]),u],ngContentSelectors:C,decls:1,vars:0,template:function(n,i){n&1&&(m(),g(0))},dependencies:[x],encapsulation:2,changeDetection:0})}return t})(),O=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=d({type:t});static \u0275inj=p({imports:[S,y,r,I,r]})}return t})();export{S as a,O as b};

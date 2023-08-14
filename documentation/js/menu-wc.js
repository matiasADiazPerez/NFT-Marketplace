'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">marketplace documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-82f68935475493ee6d27d11057f10aadcfba74ea1d126079fdc6083f0482230e4631abd2be0d204c9a15bcdbed2d0e18373d5f0bf2aee9369314b75b34e346eb"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-82f68935475493ee6d27d11057f10aadcfba74ea1d126079fdc6083f0482230e4631abd2be0d204c9a15bcdbed2d0e18373d5f0bf2aee9369314b75b34e346eb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-82f68935475493ee6d27d11057f10aadcfba74ea1d126079fdc6083f0482230e4631abd2be0d204c9a15bcdbed2d0e18373d5f0bf2aee9369314b75b34e346eb"' :
                                            'id="xs-controllers-links-module-AuthModule-82f68935475493ee6d27d11057f10aadcfba74ea1d126079fdc6083f0482230e4631abd2be0d204c9a15bcdbed2d0e18373d5f0bf2aee9369314b75b34e346eb"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-82f68935475493ee6d27d11057f10aadcfba74ea1d126079fdc6083f0482230e4631abd2be0d204c9a15bcdbed2d0e18373d5f0bf2aee9369314b75b34e346eb"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-82f68935475493ee6d27d11057f10aadcfba74ea1d126079fdc6083f0482230e4631abd2be0d204c9a15bcdbed2d0e18373d5f0bf2aee9369314b75b34e346eb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-82f68935475493ee6d27d11057f10aadcfba74ea1d126079fdc6083f0482230e4631abd2be0d204c9a15bcdbed2d0e18373d5f0bf2aee9369314b75b34e346eb"' :
                                        'id="xs-injectables-links-module-AuthModule-82f68935475493ee6d27d11057f10aadcfba74ea1d126079fdc6083f0482230e4631abd2be0d204c9a15bcdbed2d0e18373d5f0bf2aee9369314b75b34e346eb"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BidsModule.html" data-type="entity-link" >BidsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-BidsModule-3def3d4ac04565029527f2d1395fc3b09bf77d681bd1791ada2a94f4a111cec99120a1105df4dda23c467ae91b1aa1c8620f7dab5b87db4ca07f51cb22bd52e6"' : 'data-bs-target="#xs-controllers-links-module-BidsModule-3def3d4ac04565029527f2d1395fc3b09bf77d681bd1791ada2a94f4a111cec99120a1105df4dda23c467ae91b1aa1c8620f7dab5b87db4ca07f51cb22bd52e6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-BidsModule-3def3d4ac04565029527f2d1395fc3b09bf77d681bd1791ada2a94f4a111cec99120a1105df4dda23c467ae91b1aa1c8620f7dab5b87db4ca07f51cb22bd52e6"' :
                                            'id="xs-controllers-links-module-BidsModule-3def3d4ac04565029527f2d1395fc3b09bf77d681bd1791ada2a94f4a111cec99120a1105df4dda23c467ae91b1aa1c8620f7dab5b87db4ca07f51cb22bd52e6"' }>
                                            <li class="link">
                                                <a href="controllers/BidsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BidsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-BidsModule-3def3d4ac04565029527f2d1395fc3b09bf77d681bd1791ada2a94f4a111cec99120a1105df4dda23c467ae91b1aa1c8620f7dab5b87db4ca07f51cb22bd52e6"' : 'data-bs-target="#xs-injectables-links-module-BidsModule-3def3d4ac04565029527f2d1395fc3b09bf77d681bd1791ada2a94f4a111cec99120a1105df4dda23c467ae91b1aa1c8620f7dab5b87db4ca07f51cb22bd52e6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BidsModule-3def3d4ac04565029527f2d1395fc3b09bf77d681bd1791ada2a94f4a111cec99120a1105df4dda23c467ae91b1aa1c8620f7dab5b87db4ca07f51cb22bd52e6"' :
                                        'id="xs-injectables-links-module-BidsModule-3def3d4ac04565029527f2d1395fc3b09bf77d681bd1791ada2a94f4a111cec99120a1105df4dda23c467ae91b1aa1c8620f7dab5b87db4ca07f51cb22bd52e6"' }>
                                        <li class="link">
                                            <a href="injectables/BidsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BidsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ClientsModule.html" data-type="entity-link" >ClientsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ClientsModule-e56566c70ffd3a837739e2e2674ba474a85d60c10ea25e49f28b02ea43e76337e1f0e75818a78070cd6ef937ca159ffa08469ed8eb96a4d6c0b4b2b11bc96be5"' : 'data-bs-target="#xs-injectables-links-module-ClientsModule-e56566c70ffd3a837739e2e2674ba474a85d60c10ea25e49f28b02ea43e76337e1f0e75818a78070cd6ef937ca159ffa08469ed8eb96a4d6c0b4b2b11bc96be5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ClientsModule-e56566c70ffd3a837739e2e2674ba474a85d60c10ea25e49f28b02ea43e76337e1f0e75818a78070cd6ef937ca159ffa08469ed8eb96a4d6c0b4b2b11bc96be5"' :
                                        'id="xs-injectables-links-module-ClientsModule-e56566c70ffd3a837739e2e2674ba474a85d60c10ea25e49f28b02ea43e76337e1f0e75818a78070cd6ef937ca159ffa08469ed8eb96a4d6c0b4b2b11bc96be5"' }>
                                        <li class="link">
                                            <a href="injectables/Client.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Client</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DbModule.html" data-type="entity-link" >DbModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-DbModule-3325ef426a117cddd1fed2ffcf18cad4ecdea712100f4241126d3d4abd02c92d7d76da21b4eb0a99b501ae638cf2d492ebd143790a395945d23be190018cd38a"' : 'data-bs-target="#xs-injectables-links-module-DbModule-3325ef426a117cddd1fed2ffcf18cad4ecdea712100f4241126d3d4abd02c92d7d76da21b4eb0a99b501ae638cf2d492ebd143790a395945d23be190018cd38a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DbModule-3325ef426a117cddd1fed2ffcf18cad4ecdea712100f4241126d3d4abd02c92d7d76da21b4eb0a99b501ae638cf2d492ebd143790a395945d23be190018cd38a"' :
                                        'id="xs-injectables-links-module-DbModule-3325ef426a117cddd1fed2ffcf18cad4ecdea712100f4241126d3d4abd02c92d7d76da21b4eb0a99b501ae638cf2d492ebd143790a395945d23be190018cd38a"' }>
                                        <li class="link">
                                            <a href="injectables/Db.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Db</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NftsModule.html" data-type="entity-link" >NftsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-NftsModule-d6592b55bd5bf78cbfd9d3288fbcc81266baf6e46767a77cffdf0fdc30fcfe0cf22e8c5f9a71cba4e8a1812e7688b67ea2c96b2a63c5b8f6e6fbefad3aab09cf"' : 'data-bs-target="#xs-controllers-links-module-NftsModule-d6592b55bd5bf78cbfd9d3288fbcc81266baf6e46767a77cffdf0fdc30fcfe0cf22e8c5f9a71cba4e8a1812e7688b67ea2c96b2a63c5b8f6e6fbefad3aab09cf"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-NftsModule-d6592b55bd5bf78cbfd9d3288fbcc81266baf6e46767a77cffdf0fdc30fcfe0cf22e8c5f9a71cba4e8a1812e7688b67ea2c96b2a63c5b8f6e6fbefad3aab09cf"' :
                                            'id="xs-controllers-links-module-NftsModule-d6592b55bd5bf78cbfd9d3288fbcc81266baf6e46767a77cffdf0fdc30fcfe0cf22e8c5f9a71cba4e8a1812e7688b67ea2c96b2a63c5b8f6e6fbefad3aab09cf"' }>
                                            <li class="link">
                                                <a href="controllers/NftsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NftsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-NftsModule-d6592b55bd5bf78cbfd9d3288fbcc81266baf6e46767a77cffdf0fdc30fcfe0cf22e8c5f9a71cba4e8a1812e7688b67ea2c96b2a63c5b8f6e6fbefad3aab09cf"' : 'data-bs-target="#xs-injectables-links-module-NftsModule-d6592b55bd5bf78cbfd9d3288fbcc81266baf6e46767a77cffdf0fdc30fcfe0cf22e8c5f9a71cba4e8a1812e7688b67ea2c96b2a63c5b8f6e6fbefad3aab09cf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NftsModule-d6592b55bd5bf78cbfd9d3288fbcc81266baf6e46767a77cffdf0fdc30fcfe0cf22e8c5f9a71cba4e8a1812e7688b67ea2c96b2a63c5b8f6e6fbefad3aab09cf"' :
                                        'id="xs-injectables-links-module-NftsModule-d6592b55bd5bf78cbfd9d3288fbcc81266baf6e46767a77cffdf0fdc30fcfe0cf22e8c5f9a71cba4e8a1812e7688b67ea2c96b2a63c5b8f6e6fbefad3aab09cf"' }>
                                        <li class="link">
                                            <a href="injectables/NftsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NftsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SellOffersModule.html" data-type="entity-link" >SellOffersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-SellOffersModule-cec002b7b38e8a564b066ea742355c8fc272085577538c3f030a0b38149e21a9d9c9607e910f5464e0551ba2805ab27425b6ed3464c7912efd17af822e42a503"' : 'data-bs-target="#xs-controllers-links-module-SellOffersModule-cec002b7b38e8a564b066ea742355c8fc272085577538c3f030a0b38149e21a9d9c9607e910f5464e0551ba2805ab27425b6ed3464c7912efd17af822e42a503"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SellOffersModule-cec002b7b38e8a564b066ea742355c8fc272085577538c3f030a0b38149e21a9d9c9607e910f5464e0551ba2805ab27425b6ed3464c7912efd17af822e42a503"' :
                                            'id="xs-controllers-links-module-SellOffersModule-cec002b7b38e8a564b066ea742355c8fc272085577538c3f030a0b38149e21a9d9c9607e910f5464e0551ba2805ab27425b6ed3464c7912efd17af822e42a503"' }>
                                            <li class="link">
                                                <a href="controllers/SellOffersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SellOffersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SellOffersModule-cec002b7b38e8a564b066ea742355c8fc272085577538c3f030a0b38149e21a9d9c9607e910f5464e0551ba2805ab27425b6ed3464c7912efd17af822e42a503"' : 'data-bs-target="#xs-injectables-links-module-SellOffersModule-cec002b7b38e8a564b066ea742355c8fc272085577538c3f030a0b38149e21a9d9c9607e910f5464e0551ba2805ab27425b6ed3464c7912efd17af822e42a503"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SellOffersModule-cec002b7b38e8a564b066ea742355c8fc272085577538c3f030a0b38149e21a9d9c9607e910f5464e0551ba2805ab27425b6ed3464c7912efd17af822e42a503"' :
                                        'id="xs-injectables-links-module-SellOffersModule-cec002b7b38e8a564b066ea742355c8fc272085577538c3f030a0b38149e21a9d9c9607e910f5464e0551ba2805ab27425b6ed3464c7912efd17af822e42a503"' }>
                                        <li class="link">
                                            <a href="injectables/SellOffersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SellOffersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-89d78effc28e9cfd47f2727e88002578a45d6802e10ffcab1d00801992ef903b8fdf5682109653a0a8785b9338e100e81ecf9204bfc75760c088495f9d87e53d"' : 'data-bs-target="#xs-controllers-links-module-UserModule-89d78effc28e9cfd47f2727e88002578a45d6802e10ffcab1d00801992ef903b8fdf5682109653a0a8785b9338e100e81ecf9204bfc75760c088495f9d87e53d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-89d78effc28e9cfd47f2727e88002578a45d6802e10ffcab1d00801992ef903b8fdf5682109653a0a8785b9338e100e81ecf9204bfc75760c088495f9d87e53d"' :
                                            'id="xs-controllers-links-module-UserModule-89d78effc28e9cfd47f2727e88002578a45d6802e10ffcab1d00801992ef903b8fdf5682109653a0a8785b9338e100e81ecf9204bfc75760c088495f9d87e53d"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-89d78effc28e9cfd47f2727e88002578a45d6802e10ffcab1d00801992ef903b8fdf5682109653a0a8785b9338e100e81ecf9204bfc75760c088495f9d87e53d"' : 'data-bs-target="#xs-injectables-links-module-UserModule-89d78effc28e9cfd47f2727e88002578a45d6802e10ffcab1d00801992ef903b8fdf5682109653a0a8785b9338e100e81ecf9204bfc75760c088495f9d87e53d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-89d78effc28e9cfd47f2727e88002578a45d6802e10ffcab1d00801992ef903b8fdf5682109653a0a8785b9338e100e81ecf9204bfc75760c088495f9d87e53d"' :
                                        'id="xs-injectables-links-module-UserModule-89d78effc28e9cfd47f2727e88002578a45d6802e10ffcab1d00801992ef903b8fdf5682109653a0a8785b9338e100e81ecf9204bfc75760c088495f9d87e53d"' }>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Bid.html" data-type="entity-link" >Bid</a>
                            </li>
                            <li class="link">
                                <a href="classes/CloseDto.html" data-type="entity-link" >CloseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBidDto.html" data-type="entity-link" >CreateBidDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSellOfferDto.html" data-type="entity-link" >CreateSellOfferDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTokenDto.html" data-type="entity-link" >CreateTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeletedEntity.html" data-type="entity-link" >DeletedEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntityNotFound.html" data-type="entity-link" >EntityNotFound</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidId.html" data-type="entity-link" >InvalidId</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotOwner.html" data-type="entity-link" >NotOwner</a>
                            </li>
                            <li class="link">
                                <a href="classes/SellOffer.html" data-type="entity-link" >SellOffer</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePrice.html" data-type="entity-link" >UpdatePrice</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserAuth.html" data-type="entity-link" >UserAuth</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/EntityType.html" data-type="entity-link" >EntityType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FinishAuctionInput.html" data-type="entity-link" >FinishAuctionInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Window.html" data-type="entity-link" >Window</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
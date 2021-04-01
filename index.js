class FunnelbackComponent extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

        // Create a shadow root
        this.shadow = this.attachShadow({mode: 'open'});


        //Gather component settings 
        if( !this.hasAttribute('data-type') ) {
            console.error('missing option type')
            return;
        }

        let type = this.getAttribute('data-type');
        if(type != 'event-list'){
            console.error('unrecognised component type, please see documentation')
        }


        //localstorage
        this.storage = { 'name' : 'fbcomp' + type };
        this.storage.fbUserData = localStorage.getItem(this.storage.name);
        if(!this.storage.fbUserData){
            console.log('building local storage');
            let initData = {'type' : type };
            localStorage.setItem(this.storage.name, JSON.stringify(initData ) );
            localStorage.getItem(this.storage.name );
            console.log(this.storage.fbUserData)
        }else{
            console.log('data stored');
            console.log(JSON.stringify(this.storage.fbUserData))
        }





        // Create personalisation block
        let wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');

        //clear storage
        let clearButton = document.createElement('Button');
        clearButton.setAttribute('id', 'clear');
        clearButton.innerText = 'clear options';
        this._boundclearButton = this._onClearClick.bind(this);
        clearButton.addEventListener('click', this._boundclearButton);

        //print storage
        let printButton = document.createElement('Button');
        printButton.setAttribute('id', 'print');
        printButton.innerText = 'Print options';
        this._boundprintButton = this._onPrintClick.bind(this);
        printButton.addEventListener('click', this._boundprintButton);


        let content = document.createElement('div');
        content.setAttribute('id', 'content');
    
        // Create some CSS to apply to the shadow dom
        let style = document.createElement('style');
        style.textContent = this._wrapStyle()

        this.shadow.appendChild(style);
        this.shadow.appendChild(wrapper);
        wrapper.appendChild(clearButton);
        wrapper.appendChild(printButton);

        this._getHTMLContent().then( (data) => {
            content.innerHTML = data; 
            wrapper.appendChild(content); 
        })

    }

    _getHTMLContent(){
        return new Promise((resolve, reject) => {
        let fetchURL = "https://search-demo-au.funnelback.com/s/search.html?sort=date&num_ranks=3&collection=lg-events-web&query=!padrenull&profile=resident"
        fetch(fetchURL)
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
        } 
        response.text().then(function(data) {
            console.log(data) 
            resolve( data );
            });
        })
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
    });
    }


    _onClearClick(e) { 
        console.log(this.storage)
        localStorage.clear(this.storage.name)
        console.log(localStorage.getItem(this.storage.name))
    }


    _onPrintClick(e) { 
        console.log(localStorage.getItem(this.storage.name))
        let content = this.shadow.querySelector("#content");
        let data = JSON.parse(localStorage.getItem(this.storage.name))
        content.innerHTML = data.type 
    }
    
    _wrapStyle() {
    return  `
        #content {
          border: 1px solid #eee;
          padding:20px;
        }`;
    }


}

customElements.define('fb-component', FunnelbackComponent);
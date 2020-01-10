import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import CodeBlock from 'react-copy-code';

import voiceGoogle from '../data/google.json';
import voiceAmazon from '../data/amazon.json';
import voiceAzure from '../data/azure.json';
import langs from '../data/langs.json';

 
let voice = [
  ...voiceGoogle, 
  ...voiceAmazon,
  ...voiceAzure
];

let URLParams = function (searchString) {
  var self = this;
  self.searchString = searchString;
  self.get = function (name) {
      var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(self.searchString);
      if (results == null) {
          return null;
      }
      else {
          return decodeURI(results[1]) || 0;
      }
  };
}

for (const v of voice) {
  let code = v.code.toLowerCase().split('-')[0];
 
  v.nativeName = "-";

  if(v.language === v.voice && langs[code]){
    v.language = langs[code].name || '-';
  }

  if(langs[code]){
    v.nativeName = langs[code].nativeName || '-';
  }
}

function useFetch(term, setSearch) {
  const [data, updateData] = useState([])

  useEffect(() => {

    let p = new URLParams(window.location.search),
      startState = p.get('find') || "";
      

    if(term) {
      startState = term;
    }
    

    let results = voice.filter((item) => {
      
      for (const searchTerm of startState.split(" ")) {
        var toSearch = JSON.stringify(item).toLowerCase();
        if(toSearch.indexOf(searchTerm.toLowerCase()) === -1) return false;
      }

      return true;
    });

    results.sort( (a,b) => a.code > b.code ? 1 : -1);
    
    updateData(results);
  }, [term])

  return data
}

let playSample = (voice, provider) => {
  let url = `/assets/audio/${voice}.ogg`;

  if (provider == 'amazon') {
    url = `/assets/audio/${voice}.mp3`
  } else if(provider == 'azure') {
    url = `/assets/audio/${voice}.mp3`
  }
    


  let audio = new Audio( url ),
    audio_promise = audio.play();

  if (audio_promise !== undefined) {
    audio_promise.then(function() {
      
    }).catch(function(error) {
      console.log('no sample');
    });
  }
}

let smallOnly = 'd-block d-sm-block d-xs-block d-md-none',
  cols = 'd-none d-sm-none d-xs-none d-md-block',
  bigOnly = cols,
  colmds = 'd-none d-sm-none d-xs-none d-md-none d-lg-block',
  chr = "!";
  

const App = () => {

  const [search, setSearch] = useState(null);
  
  
  useEffect(() => {
    let p = new URLParams(window.location.search),
      pchr = p.get('chr');
    
    if(search == null){
      setSearch(p.get('find') || "");
    }

    if(window.localStorage['chr']) {
      chr = window.localStorage['chr'];
    }

    if(pchr) {
      chr = pchr;
      window.localStorage['chr'] = pchr;
    }
  });

  
  const result = useFetch(search, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top pr-0">
        <div className="container">
          <div className="row">
            <div className="col-6 col-md">
              <a className="navbar-brand" href="https://nullabork.gitbook.io/talkbot">
                <h3 className="p-0 m-0"><img src="/assets/img/face_200.png" className="tb-logo" style={{"width" : "37px" }} alt="Talkbot logo" />  talkbot</h3>
              </a>
            </div>
            <div className="text-right col-6 col-md-auto p-0 m-0 align-middle">
              <a href="https://www.patreon.com/bePatron?u=17524649">
                <img src="/assets/img/patreon.png" className="tb-p"  alt="Support us" /> 
              </a>

              <a href="https://github.com/nullabork/talkbot">
                <img src="/assets/img/github.png" className="tb-p"  alt="Find us on github" /> 
              </a>
            </div>
            <div className="col-12 col-md-auto pr-0 mr-0 align-middle">
              <input  className="form-control" type="search" placeholder="Search" aria-label="Search" value={search} onChange={evt => setSearch(evt.target.value || " ")} />
            </div>
          </div>
        </div>
      </nav>     


      <div className="bg-dark">
        <div className="container">
          <div className="table-responsive-sm table-responsive-xs table-responsive">
            <table className="table table-dark table-hover table-sm header-fixed">
              <thead>
                <tr>

                  <th scope="col" className={cols}>Provider</th>
                  <th scope="col"></th>
                  <th scope="col">Voice</th>
                  <th scope="col">
                    <span className={smallOnly}><span className="font-weight-normal">⚤</span></span>
                    <span className={bigOnly}>Gender </span>
                  </th>
                  
                  <th scope="col">Language</th>
                  <th scope="col" className={colmds}>-</th>
                </tr>
              </thead> 
              <tbody>
                {
                  result.map((item) => (
                    <tr key={item.voice}>
                      <td className={cols}>
                        {item.provider}
                      </td>
                      <td>
                        <button 
                            className="btn sound-button"
                            onClick={ () => playSample(item.voice, item.provider) }>
                            <span  role="img" aria-label={`play ${item.voice_alias || item.voice}, ${item.language} sample audio`}>🔊</span>
                        </button>
                      </td>
                      <td className="text-nowrap">
                        <CodeBlock>
                          <pre>
                            <code>
                                {chr}myvoice {item.voice_alias || item.voice}
                            </code>
                          </pre>
                        </CodeBlock>
                      </td>
                      <td>
                        <span className={bigOnly}>{item.gender}</span>
                        <span className={smallOnly}>{item.gender.substr(0,1)}</span>
                      </td>
                      <td className="text-nowrap">{item.language}</td>
                      <td className={colmds}>{item.nativeName}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {
        !result.length && search?(
          <p class="text-center mt-5">
            <h1>No voices matching <code>{search}</code></h1>
          </p>
        ): null
      }
    </>
  );
}


const domContainer = document.querySelector('#app');
ReactDOM.render(<App />, domContainer);
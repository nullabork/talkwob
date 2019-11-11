import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"

import voiceGoogle from '../../static/data/google.json';
import voiceAmazon from '../../static/data/amazon.json';
import langs from '../../static/data/langs.json';


import '../../static/css/bootstrap.min.css';
import '../../static/css/main.css';

let voice = [].concat(voiceGoogle, voiceAmazon);

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
 
  v.nativeName = "";

  if(v.language === v.voice && langs[code]){
    v.language = langs[code].name;
  }

  if(langs[code]){
    v.nativeName = langs[code].nativeName;
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

  let url = `/audio/${voice}.${provider === 'amazon' ?'mp3':'ogg'}`,
    audio = new Audio( url ),
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
  

export default () => {

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

    <Helmet>
      <meta charSet="utf-8" />
      <title>Talkbot voice database: the talkboting</title>
      <link rel="canonical" href="https://voices.talkbot.dev" />
      <meta property="og:description" 
        content="Customise your voice for talkbot!" />
    </Helmet>

      <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top pr-0">
        <div className="container">

          {
          //   <div className="" id="navbarNavDropdown">
          //   <form className="form-inline">
          //     <a href="https://www.patreon.com/bePatron?u=17524649">
          //       <img src="/img/patreon_logo.svg" className="tb-p"  alt="Talkbot logo" /> 
          //     </a>
              
          //   </form>
          // </div>
          }

          <div className="row">
            <div className="col-6 col-md">
              <a className="navbar-brand" href="https://nullabork.gitbook.io/talkbot">
                <h3 className="p-0 m-0"><img src="/img/face_200.png" className="tb-logo" style={{"width" : "37px" }} alt="Talkbot logo" />  talkbot</h3>
              </a>
            </div>
            <div className="text-right col-6 col-md-auto p-0 m-0 align-middle">
              <a href="https://www.patreon.com/bePatron?u=17524649">
                <img src="/img/patreon.png" className="tb-p"  alt="Support us" /> 
              </a>

              <a href="https://github.com/nullabork/talkbot">
                <img src="/img/github.png" className="tb-p"  alt="Find us on github" /> 
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
                          <code>{chr}myvoice {item.voice_alias || item.voice}</code>
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
        !result.length?(
          <p class="text-center mt-5">
            <h1>No voices matching <code>{search}</code></h1>
          </p>
        ): null
      }

    </>
  );
}

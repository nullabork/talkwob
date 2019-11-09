import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"

import voiceGoogle from '../../static/data/google.json';
import voiceAmazon from '../../static/data/amazon.json';
import langs from '../../static/data/langs.json';


import '../../static/css/bootstrap.min.css';
import '../../static/css/main.css';

let voice = [].concat(voiceGoogle, voiceAmazon);

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

    let p = new URLSearchParams(window.location.search),
      startState = term;

    if(p.has('find') && !startState) {
      startState = p.get('find');
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
  startState = "",
  chr = "!";
  

export default () => {

  const [search, setSearch] = useState(startState);

  useEffect(() => {
    let p = new URLSearchParams(window.location.search);

    if(window.localStorage['chr']) {
      chr = window.localStorage['chr'];
    }

    if(p.has('chr')) {
      chr = p.get('chr');
      window.localStorage['chr'] = chr;
    }    
  });
  
  const result = useFetch(search, []);

  return (
    <>

    <Helmet>
      <meta charSet="utf-8" />
      <title>Talkbot Voices: the talkboting</title>
      <link rel="canonical" href="https://voices.talkbot.dev" />
      <meta property="og:description" 
        content="Customise your voice for talkbot!" />
    </Helmet>

      <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
        <div className="container">
          
          <a className="navbar-brand" href="https://nullabork.gitbook.io/talkbot">
            <h3><img src="/img/face_200.png" className="tb-logo" style={{"width" : "37px" }} alt="Talkbot logo" />  talkbot</h3>
          </a>

          <div className="" id="navbarNavDropdown">
            <form className="form-inline">
              <input  className="form-control" type="search" placeholder="Search" aria-label="Search" value={search} onChange={evt => setSearch(evt.target.value)} />
            </form>
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
                  <th scope="col">voice</th>
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
    </>
  );
}

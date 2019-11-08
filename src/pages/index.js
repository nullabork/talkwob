import React, { useState, useEffect } from "react"
import voiceGoogle from '../../static/data/google.json';
import voiceAmazon from '../../static/data/amazon.json';
import langs from '../../static/data/langs.json';


import '../../static/css/bootstrap.min.css';
import '../../static/css/main.css';

let voice = [].concat(voiceGoogle, voiceAmazon);

for (const v of voice) {
  let code = v.code.toLowerCase().split('-')[0];
 
  v.nativeName = "";

  if(v.language == v.voice && langs[code]){
    v.language = langs[code].name;
  }

  if(langs[code]){
    v.nativeName = langs[code].nativeName;
  }
}

function useFetch(term, defaultData) {
  const [data, updateData] = useState(defaultData)

  useEffect(() => {
    let results = voice.filter((item) => {
      
      for (const term of term.split(" ")) {
        var toSearch = JSON.stringify(item).toLowerCase();
        if(toSearch.indexOf(term.toLowerCase()) == -1) return false;
      }

      return true;
    
    });

    results.sort( (a,b) => a.code > b.code ? 1 : -1);
    
    updateData(results);
  }, [term])

  return data
}

let playSample = (voice) => {
  document.getElementById(`voice-${voice}`).play();
}


let cols = 'd-sm-none d-xs-none d-md-block';
let colmds = 'd-sm-none d-xs-none d-md-none d-lg-block';

export default () => {
  const [search, setSearch] = useState("");
  const result = useFetch(search, []);

  return (
    <>    
      <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
        <div class="container">
          
          <a class="navbar-brand" href="#">
            <img src="/img/face_200.png" style={{"width" : "37px" }} alt="Responsive image" />  talkbot
          </a>

          <div class="" id="navbarNavDropdown">
            <form class="form-inline">
              <input  class="form-control" type="search" placeholder="Search" aria-label="Search" value={search} onChange={evt => setSearch(evt.target.value)} />
            </form>
          </div>
        </div>
      </nav>

      
      
      <div className="bg-dark">
        <div className="container">
          <div class="table-responsive-md">
            <table class="table table-dark table-hover table-sm header-fixed">
              <thead>
                <tr>

                  <th scope="col" className={cols}>Provider</th>
                  <th scope="col">voice</th>
                  <th scope="col">Gender</th>
                  
                  <th scope="col">Language</th>
                  <th scope="col" className={colmds}>Native</th>
                </tr>
              </thead>
              <tbody>
                {
                  result.map((item) => (
                    <tr key={item.voice}>
                      <td className={cols}>
                        {item.provider}
                        
                        <audio id={`voice-${item.voice}`}>
                          <source src={`/audio/${item.voice}.ogg`} type="audio/ogg" />
                          <source src={`/audio/${item.voice}.mp3`} type="audio/mp3" />
                        </audio>

                      </td>
                      <td>
                        <button 
                            class="btn sound-button"
                            onClick={ () => playSample(item.voice) }>
                            🔊
                          </button>
                          <code>!myvoice {item.voice}</code>
                      </td>
                      <td>{item.gender}</td>
                      <td>{item.language}</td>
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

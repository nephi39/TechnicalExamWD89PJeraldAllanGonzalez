import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';
function App() {
  const [activeTab, setActiveTab] = useState('tab1');
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const [lyrics, setLyrics] = useState('');
  const [lyricLines, setLyricLines] = useState([]);
  const [animationDuration, setAnimationDuration] = useState(0);
  useEffect(() => {
    const fetchLyrics = async () => {
      const options = {
        method: 'GET',
        url: 'https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/',
        params: {id: '6688199'},
        headers: {
          'X-RapidAPI-Key': '364184396fmsh2d3e833e84e077ap1f08b5jsncffc5fb0c56f',
    'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
        }
      };
      
      try {
        const response = await axios.request(options);
        setLyrics(response.data.lyrics.lyrics.body.html);
        console.log(response.data.lyrics.lyrics.body.html);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLyrics();
  }, []);
  useEffect(() => {
    // Split the lyrics into lines
    const lines = lyrics.split('\n');
    setLyricLines(lines);

    // Calculate animation duration based on the number of lines
    const duration = lines.length * 2; // Adjust the duration based on your preference
    setAnimationDuration(duration);
  }, [lyrics]);

  return (
    <div className="App">
 
  <div className="flex justify-center items-center h-screen">

    
    <div className="flex flex-col justify-center items-center bg-gray-300 p-8 rounded-3xl shadow-lg mr-8 ">
      <header className="text-center mb-8">
        <div className="cover">
          <img id="cover-img" src="https://www.billboard.com/wp-content/uploads/media/Taylor-Swift-Lover-album-art-2019-billboard-1240.jpg?w=600"  alt="cover-billboard" />
        </div>
      </header>
      <div className="song-details">
        <h2 className="text-xl font-semibold text-gray-800" id="track-name">All Too Well (Taylor's Version)</h2>
        <p className="text-gray-600" id="artist">Taylor Swift</p>
      </div>


      <div className="mt-6 flex items-center justify-between">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <i className="fas fa-music text-white"></i>
        </div>
        <div className="flex-1 ml-4 mr-2 bg-gray-200 rounded-full h-4">
          <div className="bg-green-500 rounded-full h-full w200" id="progress-bar"></div>
        </div>
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <i className="fas fa-volume-up text-white"></i>
        </div>
      </div>
    
      <div className="flex items-center justify-center space-x-4">
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500">
          <i className="fas fa-backward"></i>
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500" id="play">
          <i className="fas fa-play"></i>
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500">
          <i className="fas fa-forward"></i>
        </button>
      </div>
    </div>

  
    <div className="flex flex-col  p-8 rounded-lg shadow-lg font-sans w1000" >
      <h2 className="text-2xl font-bold mb-4 text-gray-300 text-left">Explore </h2>
      <div className="flex leading-10">

        <button  className={activeTab === 'tab1' ? 'active px-4 py-2 mr-2  text-white rounded-tl-lg font-medium' : 'px-4 py-2 mr-2  text-white rounded-tl-lg font-medium'}
          onClick={() => handleTabChange('tab1')}>Lyrics</button>
        <button className={activeTab === 'tab2' ? 'active px-4 py-2 mr-2  text-white rounded-tl-lg font-medium' : 'px-4 py-2 mr-2  text-white rounded-tl-lg font-medium'}
          onClick={() => handleTabChange('tab2')}>Other Albums</button>
        <button className={activeTab === 'tab3' ? 'active px-4 py-2 mr-2  text-white rounded-tl-lg font-medium' : 'px-4 py-2 mr-2  text-white rounded-tl-lg font-medium'}
          onClick={() => handleTabChange('tab3')}>Related Artists</button>
      </div>
      {activeTab === 'tab1' && 
      <div className="tab-content mt-4 leading-10 text-white wrapped-text text-sm font-sans h-80 overflow-y-hidden ">
        <div className="lyrics-animation-container">
          <div className="lyrics-animation" style={{ animationDuration: `${animationDuration}s` }}>
            {lyricLines.map((line, index) => (
              <div key={index} className="lyric-line" dangerouslySetInnerHTML={{ __html: line }} />
            ))}
          </div>
        </div>
  
        
      </div>
      }
       {activeTab === 'tab2' && 
       <div className="tab-content mt-4 leading-10 text-white font-sans">
        <div className="grid grid-cols-3 gap-4">
          <div className="album">
            <img src="https://upload.wikimedia.org/wikipedia/en/5/5b/Fearless_%28Taylor%27s_Version%29_%282021_album_cover%29_by_Taylor_Swift.png" alt="Album 1" className="w-72 h-72 object-cover mr-4" />
            <p className="mt-4 text-sm">Fearless (Taylor's Version)</p>
            <p className="italic text-sm">2021</p>
          </div>
          <div className="album">
            <img src="https://upload.wikimedia.org/wikipedia/en/f/f8/Taylor_Swift_-_Folklore.png" alt="Album 2" className="w-72 h-72 object-cover mr-4" />
            <p className="mt-4 text-sm">Folklore</p>
            <p className="italic text-sm">2020</p>
          </div>
          <div className="album">
            <img src="https://upload.wikimedia.org/wikipedia/en/9/9f/Midnights_-_Taylor_Swift.png" alt="Album 3" className="w-72 h-72 object-cover mr-4" />
            <p className="mt-4 text-sm">Midnights</p>
            <p className="italic text-sm">2022</p>
          </div>
        
        </div>
      </div>
      }
        {activeTab === 'tab3' && 
        <div className="tab-content mt-4  text-white font-sans">
        <div className="grid grid-cols-3 gap-4">
           <div className="artist">
             <img src="https://static01.nyt.com/images/2014/08/24/arts/24GRANDE1/24JPGRANDE1-superJumbo.jpg" alt="Artist 1"  className="w-72 h-72 object-cover mr-4" />
             <p className="mt-4 text-sm">Ariana Grande</p>
           </div>
           <div className="artist">
             <img src="https://media1.popsugar-assets.com/files/thumbor/y2o5DeDChko-_CRUgG9dmP9nkFU/0x79:1893x1972/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2020/03/11/784/n/1922398/f15602b75e69248ba66258.41958628_/i/Ed-Sheeran.jpg" alt="Artist 2" className="w-72 h-72 object-cover mr-4" />
             <p className="mt-4 text-sm">Ed Sheeran</p>
           </div>
           <div className="artist">
             <img src="https://static01.nyt.com/images/2020/08/29/arts/27album-katy1/merlin_176242068_d36e2210-c1e1-46a0-a9d3-9fde93b79514-superJumbo.jpg" alt="Artist 3" className="w-72 h-72 object-cover mr-4" />
             <p className="mt-4 text-sm">Katy Perry</p>
           </div>
       
         </div>
         
       </div>
       }
      
    </div>

  </div>
    </div>
  );
}

export default App;

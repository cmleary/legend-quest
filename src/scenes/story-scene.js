import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from './scene-keys.js';

let storyGen =''

export class StoryScene extends Phaser.Scene {
    /** @type {array} */
    #generatedstory;
  constructor() {
    super({
      key: SCENE_KEYS.STORY_SCENE,
    });
  }

  init() {
    this.#generatedstory = [] 
  }

  



  preload() {
    let prompt = 'Farquad the knight has defeated a slime';
    let prompt2 = 'Farquad the knight has been defeated by the Ice Dragon, Northern Emperor, his legend ends here'
    let genStory = []
    
    console.log(prompt)
    fetch('http://127.0.0.1:5000/storyGenerator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({prompt}),
    })
      .then((response) => {
        console.log(response.ok);
        return response.json();
      })
      .then((data) => {
        genStory.push(data)
        console.log(genStory[0].data.join().replace(",",""))
        storyGen = (genStory[0].data.join().replace(",",""))
        storyGen = storyGen.replace(/,/g,"")
        console.log(storyGen)
      })
    var url;
  
  url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js';
  this.load.plugin('rexbbcodetextplugin', url, true);
  
  url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextextpageplugin.min.js';
  this.load.plugin('rextextpageplugin', url, true);
  
  url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexttypingplugin.min.js';
  this.load.plugin('rextexttypingplugin', url, true);

  }

  
  

  create() {
    console.log(console.log(`[${StoryScene.name}:create] invoked`));

    var text = PageTypingText(this, 100, 100, '', {
    fontSize: '24px',
    wrap: {
      mode: 'word',
      width: 600
   },
   maxLines: 7
  });
  
  text.appendContent(`${storyGen}`, 70);
  
  // text.setInteractive().on('pointerup', function () {
  //   text.startNext()
  // })
  text.once('complete', function () {
    console.log('done');
  })
    
  }

  }
 

  var GetValue = Phaser.Utils.Objects.GetValue;

  function PageTypingText(scene, x, y, text, config) {
        var text = scene.add.rexBBCodeText(x, y, text, config);
        text.page = scene.plugins.get('rextextpageplugin').add(text, GetValue(config, 'page', undefined));
        text.typing = scene.plugins.get('rextexttypingplugin').add(text, GetValue(config, 'type', undefined));
        text.contents = [];
        
        text.start = function(text, speed) {      
          this.page.setText(text);
          if (speed !== undefined) {
              this.typing.setTypeSpeed(speed);
          }
          this.typeNextPage();
        };
        
        text.typeNextPage = function(speed){
          if (!this.page.isLastPage) {
            this.typing.start( text.page.getNextPage() );
          } else if (this.contents.length === 0) {
            this.emit('complete');
          }
        };
        
        text.typing.on('complete', text.typeNextPage, text);
        
        text.appendContent = function(content, speed) {
          this.contents.push([content, speed]);
          if (!this.typing.isTyping) {
            this.startNext();
          }
        }

        text.startNext =  function() {
          if (this.contents.length > 0) {
            var cmd = this.contents.shift();
            this.start(cmd[0], cmd[1]);
          }
        }
        
        return text;
  };





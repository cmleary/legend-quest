import {
  BATTLE_ASSET_KEYS,
  BATTLE_BACKGROUND_ASSET_KEYS,
  DATA_ASSET_KEYS,
  HEALTH_BAR_ASSET_KEYS,
  SPRITE_ASSET_KEYS,
  UI_ASSET_KEYS,
} from '../assets/asset-keys.js';
import Phaser from '../lib/phaser.js';
import { SCENE_KEYS } from './scene-keys.js';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENE_KEYS.PRELOAD_SCENE,
    });
  }

  preload() {
    console.log(`[${PreloadScene.name}:preload] invoked`);

    const visualsAssetPath = 'assets/images/visuals';
    const kenneysAssetPath = 'assets/images/kenneys-assets';

    // battle backgrounds
    this.load.image(
      BATTLE_BACKGROUND_ASSET_KEYS.FOREST,
      `${visualsAssetPath}/battle-backgrounds/forest_bg.png`
    );
    this.load.image(
      BATTLE_BACKGROUND_ASSET_KEYS.FROZEN_FOREST,
      `${visualsAssetPath}/battle-backgrounds/frozen_forest.jpg`
    );

    // battle assets
    this.load.image(BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND, `${kenneysAssetPath}/ui-space-expansion/custom-ui.png`);

    // health bar assets
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.RIGHT_CAP,
      `${kenneysAssetPath}/ui-space-expansion/barHorizontal_green_right.png`
    );
    this.load.image(HEALTH_BAR_ASSET_KEYS.MIDDLE, `${kenneysAssetPath}/ui-space-expansion/barHorizontal_green_mid.png`);
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.LEFT_CAP,
      `${kenneysAssetPath}/ui-space-expansion/barHorizontal_green_left.png`
    );

    this.load.image(
      HEALTH_BAR_ASSET_KEYS.RIGHT_CAP_SHADOW,
      `${kenneysAssetPath}/ui-space-expansion/barHorizontal_shadow_right.png`
    );
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.MIDDLE_SHADOW,
      `${kenneysAssetPath}/ui-space-expansion/barHorizontal_shadow_mid.png`
    );
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.LEFT_CAP_SHADOW,
      `${kenneysAssetPath}/ui-space-expansion/barHorizontal_shadow_left.png`
    );

    // monster assets
    this.load.image(SPRITE_ASSET_KEYS.SAMUS, `${visualsAssetPath}/fighters/samus.png`);
    this.load.image(SPRITE_ASSET_KEYS.MEGAMAN, `${visualsAssetPath}/fighters/megaman.png`);
    this.load.image(SPRITE_ASSET_KEYS.SLIME, `${visualsAssetPath}/fighters/Slime_0.png`);
    this.load.image(SPRITE_ASSET_KEYS.BEG_KNIGHT, `${visualsAssetPath}/fighters/Knight_Beg.png`);
    this.load.image(SPRITE_ASSET_KEYS.ADV_KNIGHT, `${visualsAssetPath}/fighters/Knight_Adv.png`);
    this.load.image(SPRITE_ASSET_KEYS.DRAGON, `${visualsAssetPath}/fighters/Dragon.png`);


    // ui assets
    this.load.image(UI_ASSET_KEYS.CURSOR, `${visualsAssetPath}/ui/cursor.png`);

    // load json data
    this.load.json(DATA_ASSET_KEYS.ATTACKS, 'assets/data/attacks.json');
  }

  create() {
    console.log(`[${PreloadScene.name}:create] invoked`);
    this.scene.start(SCENE_KEYS.BATTLE_SCENE);
  }
}

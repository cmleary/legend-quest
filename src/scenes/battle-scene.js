import Phaser from '../lib/phaser.js';
import { SPRITE_ASSET_KEYS } from '../assets/asset-keys.js';
import { BattleMenu } from '../battle/ui/menu/battle-menu.js';
import { SCENE_KEYS } from './scene-keys.js';
import { DIRECTION } from '../common/direction.js';
import { Background } from '../battle/background.js';
import { EnemyBattleMonster } from '../battle/monsters/enemy-battle-monster.js';
import { PlayerBattleMonster } from '../battle/monsters/player-battle-monster.js';

export class BattleScene extends Phaser.Scene {
  /** @type {BattleMenu} */
  #battleMenu;
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  #cursorKeys;
  /** @type {EnemyBattleMonster} */
  #activeEnemyMonster;
  /** @type {PlayerBattleMonster} */
  #activePlayerMonster;
  /** @type {number} */
  #activePlayerAttackIndex;

  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    });
  }

  init() {
    this.#activePlayerAttackIndex = -1;
  }

  create() {
    console.log(`[${BattleScene.name}:create] invoked`);

    const background = new Background(this);
    background.showFrozenForest();

    this.#activeEnemyMonster = new EnemyBattleMonster({
      scene: this,
      monsterDetails: {
        name: SPRITE_ASSET_KEYS.DRAGON,
        assetKey: SPRITE_ASSET_KEYS.DRAGON,
        assetFrame: 0,
        currentHp: 25,
        maxHp: 25,
        attackIds: [1],
        baseAttack: 80,
        currentLevel: 35,
      },
    });

    this.#activePlayerMonster = new PlayerBattleMonster({
      scene: this,
      monsterDetails: {
        name: SPRITE_ASSET_KEYS.BEG_KNIGHT,
        assetKey: SPRITE_ASSET_KEYS.BEG_KNIGHT,
        assetFrame: 0,
        currentHp: 25,
        maxHp: 60,
        attackIds: [2,3,4,6],
        baseAttack: 5,
        currentLevel: 20,
      },
    });

    this.#battleMenu = new BattleMenu(this, this.#activePlayerMonster);
    this.#battleMenu.showMainBattleMenu();

    this.#cursorKeys = this.input.keyboard.createCursorKeys();
  }

  update() {
    const wasSpaceKeyPressed = Phaser.Input.Keyboard.JustDown(this.#cursorKeys.space);
    if (wasSpaceKeyPressed) {
      this.#battleMenu.handlePlayerInput('OK');

      if (this.#battleMenu.selectedAttack === undefined) {
        return;
      }

      this.#activePlayerAttackIndex = this.#battleMenu.selectedAttack;

      if (!this.#activePlayerMonster.attacks[this.#activePlayerAttackIndex]) {
        return;
      }

      console.log(`Player selected the following move: ${this.#battleMenu.selectedAttack}`);

      this.#battleMenu.hideMonsterAttackSubMenu();
      this.#handleBattleSequence();
    }

    if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.shift)) {
      this.#battleMenu.handlePlayerInput('CANCEL');
      return;
    }

    /** @type {import('../common/direction.js').Direction} */
    let selectedDirection = DIRECTION.NONE;
    if (this.#cursorKeys.left.isDown) {
      selectedDirection = DIRECTION.LEFT;
    } else if (this.#cursorKeys.right.isDown) {
      selectedDirection = DIRECTION.RIGHT;
    } else if (this.#cursorKeys.up.isDown) {
      selectedDirection = DIRECTION.UP;
    } else if (this.#cursorKeys.down.isDown) {
      selectedDirection = DIRECTION.DOWN;
    }

    if (selectedDirection !== DIRECTION.NONE) {
      this.#battleMenu.handlePlayerInput(selectedDirection);
    }
  }

  #handleBattleSequence() {
    this.#playerAttack();
  }

  #playerAttack() {
    this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
      [
        `${this.#activePlayerMonster.name} used ${
          this.#activePlayerMonster.attacks[this.#activePlayerAttackIndex].name
        }`,
      ],
      () => {
        this.time.delayedCall(500, () => {
          this.#activeEnemyMonster.takeDamage(this.#activePlayerMonster.baseAttack, () => {
            this.#enemyAttack();
          });
        });
      }
    );
  }

  #enemyAttack() {
    if (this.#activeEnemyMonster.isFainted) {
      this.#postBattleSequenceCheck();
      return;
    }

    this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
      [`foe ${this.#activeEnemyMonster.name} used ${this.#activeEnemyMonster.attacks[0].name}`],
      () => {
        this.time.delayedCall(500, () => {
          this.#activePlayerMonster.takeDamage(this.#activeEnemyMonster.baseAttack, () => {
            this.#postBattleSequenceCheck();
          });
        });
      }
    );
  }

  #postBattleSequenceCheck() {
    if (this.#activeEnemyMonster.isFainted) {
      this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
        [`The ${this.#activeEnemyMonster.name} has been slain`, 'You are victorious!'],
        () => {
          this.#transitionToNextScene();
        }
      );
      return;
    }

    if (this.#activePlayerMonster.isFainted) {
      this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
        [`${this.#activePlayerMonster.name} has perished`, 'Your legend ends here.'],
        () => {
          this.#transitionToNextScene();
        }
      );
      return;
    }

    this.#battleMenu.showMainBattleMenu();
  }

  #transitionToNextScene() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      //if (this.#activeEnemyMonster.isFainted){
          this.scene.start(SCENE_KEYS.STORY_SCENE);
      //}
    });
  }

  
}

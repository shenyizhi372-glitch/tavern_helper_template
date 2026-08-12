/**
 * 全家亲子游 - 图鉴 / 设置 / 字段锁配置
 *
 * 图片经 jsdelivr CDN 引用（推送到 GitHub 后生效）。
 * 演示密钥：family2026（全局密钥，输入一次即可解锁全部图鉴与好感度调节）
 */
import type { FieldLock, GalleryConfig, SettingsConfig } from '../../../通用/状态栏/types';

const IMG = 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/全家亲子游/图片';

export const MASTER_KEY = 'family2026';

export const gallery: GalleryConfig = {
  masterKey: MASTER_KEY,
  characters: [
    {
      id: '孙莹',
      name: '孙莹',
      icon: '👩',
      images: [
        { id: '孙莹-日常', label: '日常', url: `${IMG}/孙莹-日常.svg` },
        {
          id: '孙莹-亲昵',
          label: '亲昵',
          url: `${IMG}/孙莹-亲昵.svg`,
          unlock: { type: 'threshold', variable: '角色.孙莹.好感度', min: 70 },
        },
        {
          id: '孙莹-沉沦',
          label: '沉沦',
          url: `${IMG}/孙莹-沉沦.svg`,
          unlock: { type: 'threshold', variable: '角色.孙莹.好感度', min: 90 },
          key: MASTER_KEY, // 单图密钥（与全局密钥相同，输入一次即解锁）
        },
      ],
    },
  ],
};

export const settings: SettingsConfig = {};

/** 好感度调节的字段锁（输入密钥解锁后可调整） */
export const affinityLock: FieldLock = {
  key: MASTER_KEY,
  hint: '输入家庭密钥后可调整好感度',
};

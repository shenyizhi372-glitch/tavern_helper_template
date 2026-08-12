/**
 * 设置与解锁状态（localStorage 持久化）
 *
 * - 主题 sb:theme / 密度 sb:density / 字号 sb:font-scale（90-130%）
 * - 已解密钥 sb:keys（密钥匹配即记录；同 key 的字段锁与图鉴共用解锁状态）
 * - 永久解锁记录 sb:gallery-unlocked（条件达成一次即永久）
 */
import { computed } from 'vue';
import type { GalleryConfig, SettingsConfig, StatusBarTheme, UnlockCondition } from './types';
import { defaultTheme, mergeTheme, presetThemes, themeToCssVars, DENSITY_FONT_SIZES } from './theme';
import { isUnlocked } from './unlock';

export interface StageImageLike {
  id: string;
  unlock?: UnlockCondition;
  key?: string;
}

export function useSettings(gallery: GalleryConfig | undefined, settings: SettingsConfig | undefined) {
  const themeId = useLocalStorage<string>('sb:theme', 'default');
  const density = useLocalStorage<'compact' | 'normal' | 'comfortable'>('sb:density', 'normal');
  const fontScale = useLocalStorage<number>('sb:font-scale', 100);
  /** 立绘宽度（px），设置界面可调（左侧边栏布局用，范围 100-240） */
  const portrait = useLocalStorage<number>('sb:portrait', 140);
  // 兼容旧值：超出范围时回到默认
  if (portrait.value < 100 || portrait.value > 240) {
    portrait.value = 140;
  }
  /** 立绘随变量切换（默认开；关=固定初始立绘，不再随好感度等条件切换） */
  const portraitAuto = useLocalStorage<boolean>('sb:portrait-auto', true);
  const keys = useLocalStorage<string[]>('sb:keys', []);
  const unlocked = useLocalStorage<string[]>('sb:gallery-unlocked', []);

  /** 全部可选主题预设：内置四套（家庭/蓝/灰/粉/夜行）+ 项目自定义 */
  const presets = computed(() => [
    ...presetThemes,
    ...(settings?.themePresets ?? []),
  ]);

  /** 当前预设：找不到时（如历史遗留的 'default'）回退到第一套 */
  const currentPreset = computed(() => presets.value.find(p => p.id === themeId.value) ?? presets.value[0]);

  const mergedTheme = computed<StatusBarTheme>(() => {
    const base = currentPreset.value ? mergeTheme(defaultTheme, currentPreset.value.theme) : defaultTheme;
    return { ...base, density: density.value };
  });

  /** CSS 变量（含字号缩放） */
  const themeStyle = computed<Record<string, string>>(() => {
    const vars = themeToCssVars(mergedTheme.value);
    const baseSize = parseFloat(DENSITY_FONT_SIZES[density.value]) * (fontScale.value / 100);
    vars['--sb-font-size'] = `${Math.round(baseSize * 100) / 100}px`;
    return vars;
  });

  /** 输入密钥：匹配图鉴/字段锁声明的 key（含 masterKey）即记录；成功返回 true */
  function tryKey(input: string): boolean {
    const key = input.trim();
    if (!key) {
      return false;
    }
    const targets = new Set<string>();
    if (gallery?.masterKey) {
      targets.add(gallery.masterKey);
    }
    gallery?.characters.forEach(character => {
      character.images.forEach(image => {
        if (image.key) {
          targets.add(image.key);
        }
      });
    });
    if (targets.has(key)) {
      if (!keys.value.includes(key)) {
        keys.value = [...keys.value, key];
      }
      return true;
    }
    return false;
  }

  /** 某密钥是否已解锁（字段锁 / 单图密钥 / masterKey 共用） */
  function keyUnlocked(key: string): boolean {
    return keys.value.includes(key);
  }

  /** 阶段图是否解锁：单图密钥 / 全局密钥（全部解锁）/ 永久记录 / 条件实时判定 */
  function imageUnlocked(image: StageImageLike, data: unknown): boolean {
    if (image.key && keyUnlocked(image.key)) {
      return true;
    }
    // 全局密钥已记录：所有图鉴图（含仅条件、无单图密钥的图）一并解锁
    if (gallery?.masterKey && keyUnlocked(gallery.masterKey)) {
      return true;
    }
    if (unlocked.value.includes(image.id)) {
      return true;
    }
    return isUnlocked(image.unlock, data);
  }

  /** 条件达成时标记永久解锁（可在 watch 中调用） */
  function markUnlocked(id: string) {
    if (!unlocked.value.includes(id)) {
      unlocked.value = [...unlocked.value, id];
    }
  }

  /** 把当前满足条件的所有图标记为永久解锁（App 渲染时调用一次） */
  function syncUnlocked(data: unknown) {
    gallery?.characters.forEach(character => {
      character.images.forEach(image => {
        if (isUnlocked(image.unlock, data) && !unlocked.value.includes(image.id)) {
          unlocked.value = [...unlocked.value, image.id];
        }
      });
    });
  }

  return {
    themeId,
    density,
    fontScale,
    portrait,
    portraitAuto,
    keys,
    presets,
    mergedTheme,
    themeStyle,
    tryKey,
    keyUnlocked,
    imageUnlocked,
    markUnlocked,
    syncUnlocked,
  };
}

export type SettingsState = ReturnType<typeof useSettings>;

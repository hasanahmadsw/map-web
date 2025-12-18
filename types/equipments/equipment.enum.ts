export enum EquipmentType {
  CAMERA = 'camera',
  LENS = 'lens',
  LIGHT = 'light',
  AUDIO = 'audio',
  ACCESSORY = 'accessory',
}

export enum MountType {
  EF = 'EF',
  RF = 'RF',
  PL = 'PL',
  E = 'E',
  L = 'L',
  MFT = 'MFT',
}

export enum SensorType {
  FULL_FRAME = 'full_frame',
  SUPER35 = 'super35',
  APS_C = 'aps_c',
  MFT = 'mft',
}
// Resolution Types
export enum ResolutionType {
  FOUR_K = '4K',
  FOUR_FIVE_K = '4.5K',
  FIVE_K = '5K',
  SIX_K = '6K',
  EIGHT_K = '8K',
}

// Light Mount Types
export enum LightMountType {
  BOWENS = 'Bowens',
  JUNIOR_PIN = 'JuniorPin',
  BABY_PIN = 'BabyPin',
  STAND_MOUNT = 'StandMount',
}

// Audio Categories
export enum AudioCategory {
  MIC = 'mic',
  RECORDER = 'recorder',
  WIRELESS = 'wireless',
  MIXER = 'mixer',
}

// Microphone Patterns
export enum MicrophonePattern {
  CARDIOID = 'cardioid',
  SUPERCARDIOID = 'supercardioid',
  OMNI = 'omni',
  SHOTGUN = 'shotgun',
}

export enum MediaFormat {
  CFast2 = 'CFast2',
  SD = 'SD',
  CFexpress = 'CFexpress',
  SSD = 'SSD',
  XQD = 'XQD',
}

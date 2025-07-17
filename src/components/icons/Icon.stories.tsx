import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import OtokuIcon from './OtokuIcon';
import GamanIcon from './GamanIcon';
import CameraIcon from './CameraIcon';
import ManualIcon from './ManualIcon';
import GalleryIcon from './GalleryIcon';
import SettingsIcon from './SettingsIcon';


const meta: Meta = {
  title: 'Icons/Overview',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

// おトクアイコン
export const OtokuDefault: StoryObj = {
  render: () => <OtokuIcon />,
};

export const OtokuLarge: StoryObj = {
  render: () => <OtokuIcon width={64} height={64} />,
};

export const OtokuCustomColor: StoryObj = {
  render: () => <OtokuIcon color="#22C55E" />,
};

// ガマンアイコン
export const GamanDefault: StoryObj = {
  render: () => <GamanIcon />,
};

export const GamanLarge: StoryObj = {
  render: () => <GamanIcon width={64} height={64} />,
};

export const GamanCustomColor: StoryObj = {
  render: () => <GamanIcon color="#EF4444" />,
};

// カメラアイコン
export const CameraDefault: StoryObj = {
  render: () => <CameraIcon />,
};

export const CameraLarge: StoryObj = {
  render: () => <CameraIcon width={64} height={64} />,
};

export const CameraBlue: StoryObj = {
  render: () => <CameraIcon color="#3B82F6" />,
};

// アイコン一覧表示
export const IconSet: StoryObj = {
  render: () => (
    <div className="flex space-x-8 items-center ">
      <div className="text-center">
        <OtokuIcon />
        <p className="mt-2 text-sm text-gray-600">おトク</p>
      </div>
      <div className="text-center">
        <GamanIcon />
        <p className="mt-2 text-sm text-gray-600">ガマン</p>
      </div>
      <div className="text-center">
        <CameraIcon />
        <p className="mt-2 text-sm text-gray-600">カメラ</p>
      </div>
      <div className="text-center">
        <ManualIcon />
        <p className="mt-2 text-sm text-gray-600">手入力</p>
      </div>
      <div className="items-center">
        <GalleryIcon />
        <p className="mt-2 text-sm text-gray-600">カメラロール</p>
      </div>
      <div className="items-center">
        <SettingsIcon />
        <p className="mt-2 text-sm text-gray-600">カメラロール</p>
      </div>
    </div>
  ),
};

// サイズバリエーション
export const SizeVariations: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <OtokuIcon width={24} height={24} />
        <OtokuIcon width={32} height={32} />
        <OtokuIcon width={40} height={40} />
        <OtokuIcon width={64} height={64} />
      </div>
      <div className="flex items-center space-x-4">
        <GamanIcon width={24} height={24} />
        <GamanIcon width={32} height={32} />
        <GamanIcon width={40} height={40} />
        <GamanIcon width={64} height={64} />
      </div>
      <div className="flex items-center space-x-4">
        <CameraIcon width={24} height={24} />
        <CameraIcon width={32} height={32} />
        <CameraIcon width={40} height={40} />
        <CameraIcon width={64} height={64} />
      </div>
    </div>
  ),
};
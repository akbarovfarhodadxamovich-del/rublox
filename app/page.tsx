'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Home, User, MessageSquare, Users, Smile,
  Package, Repeat, Users2, ThumbsUp, Settings, X, Send, Play, ChevronLeft, Plus, ChevronRight, ExternalLink, Lock, CheckCircle2, LogIn, UserPlus, LogOut
} from 'lucide-react';
import * as THREE from 'three';

interface GameItem {
  id: number;
  title: string;
  rating?: string;
  isAd?: boolean;
  players?: string;
  description?: string;
  creator?: string;
}

const uniqueGameList: { title: string; creator: string; desc: string }[] = [
  { title: 'Наследие короля', creator: 'GamerRobot Inc', desc: 'Станьте мастером меча или мощным пользователем фруктов.' },
  { title: 'Бесконечный бой скриптов', creator: 'Wolfpaq', desc: 'Ролевая игра в красивом городе с огромными возможностями.' },
  { title: 'Тихое место: Мертвая зона', creator: 'DreamCraft', desc: 'Выращивайте питомцев, торгуйте и исследуйте остров.' },
  { title: 'Оборона туалетной башни', creator: 'YXCeptional Studios', desc: 'Заберитесь на вершину башни без чекпоинтов.' },
  { title: 'Ultimate Mining Tycoon', creator: 'Nikilis', desc: 'Раскройте убийцу или выживайте до конца раунда.' },
  { title: 'BedWars', creator: 'Easy Games', desc: 'Защищайте свою кровать и уничтожайте базы противников.' },
  { title: 'Arsenal', creator: 'ROLVe Community', desc: 'Динамичный шутер с огромным арсеналом оружия.' },
  { title: 'Evade', creator: 'Hexagon Development Community', desc: 'Убегайте от жутких ботов на разнообразных картах.' }
];

const createGameSet = (startId: number, count: number): GameItem[] => {
  const list: GameItem[] = [];
  for (let i = 0; i < count; i++) {
    const itemData = uniqueGameList[(startId + i) % uniqueGameList.length];
    const uniqueSuffix = Math.floor((startId + i) / uniqueGameList.length);
    const title = uniqueSuffix > 0 ? `${itemData.title} ${uniqueSuffix + 1}` : itemData.title;

    list.push({
      id: startId + i,
      title,
      creator: itemData.creator,
      description: itemData.desc,
      rating: `${85 + (i % 12)}%`,
      players: `${((i * 1.7 + 1.2) % 65 + 0.8).toFixed(1)}K`
    });
  }
  return list;
};

const mainRecommendations: GameItem[] = createGameSet(100, 12);
const chartGamesList: GameItem[] = createGameSet(200, 10);
const allGames = [...mainRecommendations, ...chartGamesList];

const baseFriendsList = [
  { name: "U_U", status: "3008 (2,74)", online: true },
  { name: "Timi", status: "[30 минут] Blad...", online: true },
  { name: "FFT_LAVASH", status: "Фрукты Блокс", online: true },
  { name: "Lunyaa", status: "Эвейд", online: true },
  { name: "fotma_18", status: "[РЕГИСТРАЦИЯ] П...", online: false },
  { name: "NErPuK1488", status: "Фрукты Блокс", online: true },
  { name: "Ghosty", status: "Ракеты против г...", online: true },
  { name: "Reivvn", status: "Фрукты Блокс", online: true },
  { name: "Red_Teamer", status: "Бумити к ядру 3...", online: true },
  { name: "DarkKnight99", status: "В игре", online: true },
  { name: "ProGamer_RU", status: "В игре", online: true },
  { name: "BloxMaster2026", status: "Не в сети", online: false }
];

export default function RobloxLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Home');

  const [robuxBalance, setRobuxBalance] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('roblox_robux');
      return saved ? Number(saved) : 0;
    }
    return 0;
  });

  const [currentTheme, setCurrentTheme] = useState<'Dark' | 'Light' | 'Classic'>('Dark');
  const [currentLang] = useState<'Русский' | 'English'>('Русский');
  
  const [showRobuxModal, setShowRobuxModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Авторизация с сохранением в localStorage
  const [isAuthOpen, setIsAuthOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('roblox_isLoggedIn') !== 'true';
    }
    return true;
  });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('roblox_username') || 'YotouUxxdds';
    }
    return 'YotouUxxdds';
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('roblox_isLoggedIn') === 'true';
    }
    return false;
  });
  
  const [friends] = useState(baseFriendsList);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);
  const [chatHistories, setChatHistories] = useState<Record<string, {sender: string, text: string}[]>>({
    "U_U": [{ sender: "U_U", text: "Го в Брукхейвен?" }]
  });
  
  const [inputMessage, setInputMessage] = useState('');
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('roblox_maxLevel');
      return saved ? Number(saved) : 1;
    }
    return 1;
  }); 
  const [selectedLevel, setSelectedLevel] = useState(1);       
  
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(true);
  
  const [staminaPercent, setStaminaPercent] = useState(100);
  const [staminaStateText, setStaminaStateText] = useState('ГОТОВО');

  useEffect(() => {
    localStorage.setItem('roblox_maxLevel', maxUnlockedLevel.toString());
  }, [maxUnlockedLevel]);

  useEffect(() => {
    localStorage.setItem('roblox_robux', robuxBalance.toString());
  }, [robuxBalance]);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('roblox_username', currentUser);
      localStorage.setItem('roblox_isLoggedIn', 'true');
    }
  }, [isLoggedIn, currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('roblox_username');
    localStorage.removeItem('roblox_isLoggedIn');
    setIsLoggedIn(false);
    setCurrentUser('Гость');
    setUsernameInput('');
    setPasswordInput('');
    setIsAuthOpen(true);
  };

  const flashlightOnRef = useRef(flashlightOn);
  flashlightOnRef.current = flashlightOn;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const robloxProfileUrl = "https://www.roblox.com/users/4309585604/profile";

  const isSearching = searchQuery.trim().length > 0;
  const searchResults = allGames.filter((game, index, self) => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
    self.findIndex(g => g.id === game.id) === index
  );

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setCurrentUser(usernameInput.trim());
    setIsLoggedIn(true);
    setIsAuthOpen(false);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeChatUser) return;
    setChatHistories(prev => {
      const userHistory = prev[activeChatUser] || [];
      return {
        ...prev,
        [activeChatUser]: [...userHistory, { sender: 'Вы', text: inputMessage }]
      };
    });
    setInputMessage('');
  };

  const startLevel = (lvl: number) => {
    setSelectedLevel(lvl);
    setSelectedGame(null);
    setIsPlaying(true);
    setScore(0);
    setGameOver(false);
    setLevelCompleted(false);
    setFlashlightOn(true);
  };

  const getLevelConfig = (lvl: number) => {
    switch (lvl) {
      case 1:
        return { target: 25, staminaMax: Infinity, staminaCd: 0, monstersCount: 1, glitch: false };
      case 2:
        return { target: 35, staminaMax: 25, staminaCd: 15, monstersCount: 1, glitch: false };
      case 3:
        return { target: 40, staminaMax: 25, staminaCd: 15, monstersCount: 1, glitch: false };
      case 4:
        return { target: 45, staminaMax: 25, staminaCd: 15, monstersCount: 1, glitch: false };
      case 5:
        return { target: 50, staminaMax: 25, staminaCd: 15, monstersCount: 1, glitch: false };
      case 6:
        return { target: 55, staminaMax: 25, staminaCd: 15, monstersCount: 1, glitch: false };
      case 7:
        return { target: 60, staminaMax: 25, staminaCd: 15, monstersCount: 1, glitch: false };
      case 8:
        return { target: 70, staminaMax: 10, staminaCd: 15, monstersCount: 1, glitch: false };
      case 9:
        return { target: 100, staminaMax: 8, staminaCd: 15, monstersCount: 2, glitch: false };
      case 10:
        return { target: 200, staminaMax: 7, staminaCd: 20, monstersCount: 2, glitch: true };
      default:
        return { target: 25, staminaMax: Infinity, staminaCd: 0, monstersCount: 1, glitch: false };
    }
  };

  useEffect(() => {
    if (!isPlaying) return;
    const container = containerRef.current;
    if (!container) return;

    const config = getLevelConfig(selectedLevel);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010103);
    scene.fog = new THREE.FogExp2(0x010103, 0.045);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x050510, 0.3);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0x223355, 0.2);
    moonLight.position.set(20, 40, 20);
    scene.add(moonLight);

    const flashlightGroup = new THREE.Group();
    const flashlightBodyMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.2 });
    const casing = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.4, 12), flashlightBodyMat);
    casing.rotation.x = Math.PI / 2;
    flashlightGroup.add(casing);

    const headMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.6, roughness: 0.3 });
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.06, 0.15, 12), headMat);
    head.rotation.x = Math.PI / 2;
    head.position.z = -0.2;
    flashlightGroup.add(head);

    const defaultFlashlightIntensity = config.glitch ? 2.2 : 5.0;
    const flashlight = new THREE.SpotLight(0xfff8e7, defaultFlashlightIntensity, config.glitch ? 20 : 35, Math.PI / 5, 0.4, 1);
    flashlight.position.set(0, 0, -0.25);
    flashlight.target.position.set(0, 0, -15);
    flashlightGroup.add(flashlight);
    flashlightGroup.add(flashlight.target);

    flashlightGroup.position.set(0.35, -0.3, -0.5);
    camera.add(flashlightGroup);
    scene.add(camera);

    const groundMat = new THREE.MeshStandardMaterial({ color: 0x081008, roughness: 0.95 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x2b2b36, roughness: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x140d07, roughness: 0.9 });

    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const graveBoxGeo = new THREE.BoxGeometry(0.8, 1.3, 0.35);
    const crossVertGeo = new THREE.BoxGeometry(0.3, 1.6, 0.2);
    const crossHorizGeo = new THREE.BoxGeometry(1.0, 0.3, 0.2);

    const colliders: THREE.Box3[] = [];

    for (let i = 0; i < 45; i++) {
      const x = (Math.random() - 0.5) * 75;
      const z = (Math.random() - 0.5) * 75;
      if (Math.abs(x) < 4 && Math.abs(z) < 4) continue;

      let objectMesh;
      let halfHeight = 0;

      if (Math.random() > 0.4) {
        objectMesh = new THREE.Mesh(graveBoxGeo, stoneMat);
        halfHeight = 1.3 / 2;
      } else {
        const group = new THREE.Group();
        const vPart = new THREE.Mesh(crossVertGeo, woodMat);
        vPart.position.y = 0.8;
        const hPart = new THREE.Mesh(crossHorizGeo, woodMat);
        hPart.position.y = 1.1;
        group.add(vPart);
        group.add(hPart);
        objectMesh = group;
        halfHeight = 0;
      }

      objectMesh.position.set(x, halfHeight, z);
      objectMesh.rotation.y = Math.random() * Math.PI;
      scene.add(objectMesh);

      const collider = new THREE.Box3().setFromObject(objectMesh);
      colliders.push(collider);
    }

    const cryptGeo = new THREE.BoxGeometry(4.5, 3.2, 5.5);
    for (let i = 0; i < 4; i++) {
      const crypt = new THREE.Mesh(cryptGeo, stoneMat);
      const cx = (i % 2 === 0 ? 1 : -1) * (18 + Math.random() * 8);
      const cz = (i < 2 ? 1 : -1) * (18 + Math.random() * 8);
      crypt.position.set(cx, 3.2 / 2, cz);
      scene.add(crypt);
      const collider = new THREE.Box3().setFromObject(crypt);
      colliders.push(collider);
    }

    const skullGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const skullMat = new THREE.MeshStandardMaterial({ color: 0xe6e6da, emissive: 0x223311, roughness: 0.4 });
    let coins: { mesh: THREE.Mesh; x: number; z: number }[] = [];

    for (let i = 0; i < 12; i++) {
      const skull = new THREE.Mesh(skullGeo, skullMat);
      const rx = (Math.random() - 0.5) * 55;
      const rz = (Math.random() - 0.5) * 55;
      skull.position.set(rx, 0.3, rz);
      scene.add(skull);
      coins.push({ mesh: skull, x: rx, z: rz });
    }

    const createMonsterMesh = () => {
      const monsterGroup = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0a0505, roughness: 0.3, metalness: 0.4 });
      const bodyMesh = new THREE.Mesh(new THREE.ConeGeometry(0.7, 3.2, 12), bodyMat);
      bodyMesh.position.y = 1.6;
      monsterGroup.add(bodyMesh);

      const mouthGroup = new THREE.Group();
      const mouthGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.4, 12);
      const mouthMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
      mouthMesh.rotation.x = Math.PI / 2;
      mouthGroup.add(mouthMesh);

      const toothMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      for (let t = 0; t < 6; t++) {
        const angle = (t / 6) * Math.PI * 2;
        const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.15, 4), toothMat);
        tooth.position.set(Math.sin(angle) * 0.3, 0, Math.cos(angle) * 0.1);
        mouthGroup.add(tooth);
      }
      mouthGroup.position.set(0, 2.7, 0.25);
      monsterGroup.add(mouthGroup);

      const eyeBgMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

      const createEye = (x: number) => {
        const eyeGroup = new THREE.Group();
        const outer = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), eyeBgMat);
        const inner = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), pupilMat);
        inner.position.z = 0.1;
        eyeGroup.add(outer);
        eyeGroup.add(inner);
        eyeGroup.position.set(x, 3.1, 0.35);
        return eyeGroup;
      };

      monsterGroup.add(createEye(-0.25));
      monsterGroup.add(createEye(0.25));

      const tentacles: THREE.Mesh[] = [];
      const tentacleMat = new THREE.MeshStandardMaterial({ color: 0x050202, roughness: 0.5 });
      for (let i = 0; i < 6; i++) {
        const tentacle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.1, 2.2, 6), tentacleMat);
        const side = i % 2 === 0 ? 1 : -1;
        const heightOffset = 1.0 + (i * 0.3);
        tentacle.position.set(side * 0.6, heightOffset, 0);
        tentacle.rotation.z = side * (0.5 + i * 0.2);
        tentacle.rotation.x = (i - 3) * 0.2;
        
        tentacle.userData = { 
          baseRotZ: tentacle.rotation.z, 
          baseRotX: tentacle.rotation.x, 
          speed: 8 + i, 
          index: i 
        };
        monsterGroup.add(tentacle);
        tentacles.push(tentacle);
      }

      return { group: monsterGroup, tentacles, mouthGroup };
    };

    const monstersList: { group: THREE.Group; tentacles: THREE.Mesh[]; mouthGroup: THREE.Group }[] = [];
    
    const m1 = createMonsterMesh();
    m1.group.position.set(0, 0, -30);
    scene.add(m1.group);
    monstersList.push(m1);

    if (config.monstersCount >= 2) {
      const m2 = createMonsterMesh();
      m2.group.position.set(25, 0, 25);
      scene.add(m2.group);
      monstersList.push(m2);
    }

    let monsterSpeed = 0.038 + (selectedLevel * 0.002);

    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let isSprintingPressed = false;
    
    let yaw = 0;   
    let pitch = 0; 

    let currentStamina = config.staminaMax === Infinity ? 100 : config.staminaMax;
    let staminaCooldownTimer = 0;
    let isExhausted = false;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') moveForward = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') moveBackward = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') moveLeft = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') moveRight = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') isSprintingPressed = true;
      if (e.code === 'KeyF') {
        setFlashlightOn(prev => !prev);
      }
      if (e.key === '/') {
        if (document.pointerLockElement) document.exitPointerLock();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') moveForward = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') moveBackward = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') moveLeft = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') moveRight = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') isSprintingPressed = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === container) {
        const sensitivity = 0.002;
        yaw -= e.movementX * sensitivity;
        pitch -= e.movementY * sensitivity;

        const maxPitch = Math.PI / 2.2;
        if (pitch > maxPitch) pitch = maxPitch;
        if (pitch < -maxPitch) pitch = -maxPitch;

        camera.rotation.order = 'YXZ';
        camera.rotation.y = yaw;
        camera.rotation.x = pitch;
      }
    };

    const onClickContainer = () => {
      if (!document.pointerLockElement) {
        container.requestPointerLock();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onClickContainer);

    let currentScore = 0;
    let animId: number;
    let clock = new THREE.Clock();
    const playerBox = new THREE.Box3();

    const playCoinSound = () => {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1174.66, audioCtx.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (err) {}
    };

    const playJumpscareSound = () => {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.8);
        gainNode.gain.setValueAtTime(1.0, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.9);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.9);
      } catch (err) {}
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      let isSprinting = false;
      if (config.staminaMax === Infinity) {
        isSprinting = isSprintingPressed;
        setStaminaPercent(100);
        setStaminaStateText('БЕЗЛИМИТ');
      } else {
        if (staminaCooldownTimer > 0) {
          staminaCooldownTimer -= delta;
          isExhausted = true;
          setStaminaStateText(`КД: ${Math.ceil(staminaCooldownTimer)}с`);
          setStaminaPercent(Math.round((staminaCooldownTimer / config.staminaCd) * 100));
        } else {
          if (isExhausted) {
            currentStamina = config.staminaMax;
            isExhausted = false;
          }
          if (isSprintingPressed && (moveForward || moveBackward || moveLeft || moveRight)) {
            isSprinting = true;
            currentStamina -= delta;
            setStaminaStateText('БЕГ');
            setStaminaPercent(Math.max(0, Math.round((currentStamina / config.staminaMax) * 100)));
            if (currentStamina <= 0) {
              staminaCooldownTimer = config.staminaCd;
            }
          } else {
            if (currentStamina < config.staminaMax) {
              currentStamina += delta * 0.8;
            } else {
              currentStamina = config.staminaMax;
            }
            setStaminaStateText('ГОТОВО');
            setStaminaPercent(Math.round((currentStamina / config.staminaMax) * 100));
          }
        }
      }

      const baseSpeed = 0.05;
      const speed = isSprinting ? baseSpeed * 1.9 : baseSpeed;
      const oldPosition = camera.position.clone();

      if (moveForward) {
        camera.position.x -= Math.sin(yaw) * speed;
        camera.position.z -= Math.cos(yaw) * speed;
      }
      if (moveBackward) {
        camera.position.x += Math.sin(yaw) * speed;
        camera.position.z += Math.cos(yaw) * speed;
      }
      if (moveLeft) {
        camera.position.x -= Math.cos(yaw) * speed;
        camera.position.z += Math.sin(yaw) * speed;
      }
      if (moveRight) {
        camera.position.x += Math.cos(yaw) * speed;
        camera.position.z -= Math.sin(yaw) * speed;
      }

      if (camera.position.x > 45 || camera.position.x < -45) camera.position.x = oldPosition.x;
      if (camera.position.z > 45 || camera.position.z < -45) camera.position.z = oldPosition.z;

      playerBox.setFromCenterAndSize(camera.position, new THREE.Vector3(0.6, 1.8, 0.6));
      for (let i = 0; i < colliders.length; i++) {
        if (playerBox.intersectsBox(colliders[i])) {
          camera.position.copy(oldPosition);
          break;
        }
      }

      let playerDead = false;

      monstersList.forEach(m => {
        const dx = camera.position.x - m.group.position.x;
        const dz = camera.position.z - m.group.position.z;
        const distToPlayer = Math.sqrt(dx * dx + dz * dz);

        if (distToPlayer > 0.8) {
          m.group.position.x += (dx / distToPlayer) * monsterSpeed;
          m.group.position.z += (dz / distToPlayer) * monsterSpeed;
          m.group.rotation.y = Math.atan2(dx, dz);
          m.group.position.y = Math.abs(Math.sin(time * 10)) * 0.15;
        }

        m.tentacles.forEach((tentacle) => {
          const { baseRotZ, baseRotX, speed, index } = tentacle.userData;
          const sideMultiplier = index % 2 === 0 ? 1 : -1;
          tentacle.rotation.z = baseRotZ + Math.sin(time * speed) * 0.3 * sideMultiplier;
          tentacle.rotation.x = baseRotX + Math.cos(time * (speed * 0.8)) * 0.2;
        });

        const mouthScale = 1 + Math.sin(time * 18) * 0.25;
        m.mouthGroup.scale.set(mouthScale, 1, mouthScale);

        if (distToPlayer < 1.3) {
          playerDead = true;
        }
      });

      if (playerDead) {
        playJumpscareSound();
        setGameOver(true);
        if (document.pointerLockElement) document.exitPointerLock();
        cancelAnimationFrame(animId);
        return;
      }

      coins.forEach((coin, index) => {
        coin.mesh.rotation.y += 0.04;
        const cdx = camera.position.x - coin.mesh.position.x;
        const cdz = camera.position.z - coin.mesh.position.z;
        if (Math.sqrt(cdx * cdx + cdz * cdz) < 1.2) {
          playCoinSound();
          scene.remove(coin.mesh);
          coins.splice(index, 1);
          currentScore += 1;
          setScore(currentScore);

          if (currentScore >= config.target) {
            setLevelCompleted(true);
            if (selectedLevel >= maxUnlockedLevel && selectedLevel < 10) {
              setMaxUnlockedLevel(selectedLevel + 1);
            }
            if (document.pointerLockElement) document.exitPointerLock();
            cancelAnimationFrame(animId);
            return;
          }

          if (currentScore >= 50) {
            const jumpChance = Math.random();
            if (jumpChance < 0.125) {
              const nearestMonster = monstersList[0].group;
              const targetDx = nearestMonster.position.x - camera.position.x;
              const targetDz = nearestMonster.position.z - camera.position.z;
              yaw = Math.atan2(-targetDx, -targetDz);
              pitch = 0.1;
            }
          }

          const newSkull = new THREE.Mesh(skullGeo, skullMat);
          newSkull.position.set((Math.random() - 0.5) * 55, 0.3, (Math.random() - 0.5) * 55);
          scene.add(newSkull);
          coins.push({ mesh: newSkull, x: newSkull.position.x, z: newSkull.position.z });
        }
      });

      const isFlashlightActive = flashlightOnRef.current;
      if (config.glitch && isFlashlightActive) {
        const flicker = Math.random();
        if (flicker < 0.1) {
          flashlight.intensity = 0.5;
        } else if (flicker < 0.2) {
          flashlight.intensity = 3.0;
        } else {
          flashlight.intensity = 2.0;
        }
      } else {
        flashlight.intensity = isFlashlightActive ? 5.0 : 0.0;
      }
      flashlightGroup.visible = isFlashlightActive;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', handleResize);
      if (container) container.innerHTML = '';
    };
  }, [isPlaying, gameOver, levelCompleted, selectedLevel]);

  const themeClasses = {
    Dark: {
      bg: 'bg-[#111216]',
      text: 'text-white',
      header: 'bg-[#191b1d] border-[#232527]',
      sidebar: 'bg-[#111216] border-[#191b1d]',
      card: 'bg-[#191b1d] hover:bg-[#232527] border-[#393b3d]',
      panel: 'bg-[#191b1d] border-[#232527]',
      input: 'bg-[#25282c] border-[#393b3d] text-white',
    },
    Light: {
      bg: 'bg-gray-100',
      text: 'text-gray-900',
      header: 'bg-white border-gray-200',
      sidebar: 'bg-white border-gray-200',
      card: 'bg-white hover:bg-gray-50 border-gray-200',
      panel: 'bg-white border-gray-200',
      input: 'bg-gray-50 border-gray-300 text-gray-900',
    },
    Classic: {
      bg: 'bg-[#e5e5e5]',
      text: 'text-black',
      header: 'bg-[#002b5c] text-white border-blue-900',
      sidebar: 'bg-[#d0d0d0] border-gray-400',
      card: 'bg-white hover:bg-blue-50 border-gray-400',
      panel: 'bg-white border-gray-400',
      input: 'bg-white border-gray-400 text-black',
    }
  }[currentTheme];

  const t = {
    'Русский': {
      home: 'Home', charts: 'Charts', marketplace: 'Marketplace', create: 'Create', robux: 'Robux',
      search: 'Search', friends: 'Friends', profile: 'Profile', messages: 'Messages',
      avatar: 'Avatar', inventory: 'Inventory', trade: 'Trade', communities: 'Communities',
      recommendations: 'Рекомендации для тебя', seeAll: 'See All'
    },
    'English': {
      home: 'Home', charts: 'Charts', marketplace: 'Marketplace', create: 'Create', robux: 'Robux',
      search: 'Search', friends: 'Friends', profile: 'Profile', messages: 'Messages',
      avatar: 'Avatar', inventory: 'Inventory', trade: 'Trade', communities: 'Communities',
      recommendations: 'Recommended for You', seeAll: 'See All'
    }
  }[currentLang];

  const renderContent = () => {
    if (isSearching) {
      return (
        <section className="pb-20">
          <h2 className="text-2xl font-bold mb-6">Результаты поиска: "{searchQuery}" ({searchResults.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {searchResults.map((item) => (
              <GameCard key={`search-${item.id}`} item={item} onClick={() => setSelectedGame(item)} theme={themeClasses} />
            ))}
          </div>
        </section>
      );
    }

    switch (activeTab) {
      case 'Home':
        return (
          <div className="space-y-8 pb-24">
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">Friends ({friends.length})</h2>
                <button onClick={() => setActiveTab('Friends')} className="text-sm font-semibold opacity-80 hover:opacity-100 flex items-center">
                  See All <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="flex items-center space-x-5 overflow-x-auto pb-3 pt-1 scrollbar-none">
                <div 
                  onClick={() => alert("Запрос на добавление в друзья отправлен!")} 
                  className="flex flex-col items-center cursor-pointer flex-shrink-0 group"
                >
                  <div className="w-16 h-16 bg-[#25282c] group-hover:bg-[#35383c] rounded-full flex items-center justify-center relative border border-[#393b3d] transition">
                    <Plus className="w-7 h-7 text-white" />
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#111216]">1</span>
                  </div>
                  <span className="text-xs font-semibold mt-1.5 opacity-90">Add Friends</span>
                </div>

                {friends.map((friend, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setIsChatOpen(true);
                      setActiveChatUser(friend.name);
                    }}
                    className="flex flex-col items-center cursor-pointer flex-shrink-0 w-20 text-center group"
                  >
                    <div className="w-16 h-16 bg-gray-700 rounded-full relative overflow-hidden border border-[#393b3d] group-hover:border-white transition">
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-white font-bold">
                        {friend.name.substring(0, 2).toUpperCase()}
                      </div>
                      {friend.online && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#111216]"></span>
                      )}
                    </div>
                    <span className="text-xs font-bold mt-1.5 truncate w-full">{friend.name}</span>
                    <span className="text-[10px] opacity-60 truncate w-full">{friend.status}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">{t.recommendations}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mainRecommendations.map((item) => (
                  <GameCard key={item.id} item={item} onClick={() => setSelectedGame(item)} theme={themeClasses} />
                ))}
              </div>
            </section>
          </div>
        );

      case 'Charts':
        return (
          <section className="pb-24">
            <h2 className="text-3xl font-extrabold mb-6">Charts</h2>
            <div className="flex flex-col space-y-3">
              {chartGamesList.map((game) => (
                <div 
                  key={game.id} 
                  onClick={() => setSelectedGame(game)} 
                  className={`flex items-center p-3 rounded-lg transition cursor-pointer border ${themeClasses.card} shadow-sm`}
                >
                  <div className="w-20 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center mr-4 ml-1 flex-shrink-0">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-base font-bold truncate">{game.title}</h3>
                    <p className="text-xs opacity-70 truncate">От {game.creator}</p>
                    <div className="flex items-center space-x-4 text-xs font-semibold opacity-70 mt-1">
                      <span className="flex items-center"><ThumbsUp className="w-3 h-3 text-green-500 mr-1" /> {game.rating} Rating</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'Profile':
        return (
          <div className="max-w-5xl mx-auto space-y-6 pb-24">
            <div className={`rounded-xl border overflow-hidden relative ${themeClasses.panel}`}>
              <div className="h-72 bg-gradient-to-b from-[#1a1c23] to-[#111216] flex items-center justify-center relative">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-48 h-48 bg-[#1e2028] rounded-full border-4 border-black/50 overflow-hidden flex items-center justify-center shadow-2xl relative">
                    <img 
                      src="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-BEEB9CE5D9B404987E987DA620302E9B-Png/150/150/AvatarHeadshot/Png/noFilter" 
                      alt="Avatar"
                      className="w-full h-full object-cover scale-110"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4 relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
                  <div className="flex items-end space-x-4">
                    <div className="w-24 h-24 rounded-full bg-gray-800 border-4 border-[#111216] overflow-hidden shadow-xl flex-shrink-0 -mt-14 relative z-10 bg-black">
                      <img 
                        src="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-BEEB9CE5D9B404987E987DA620302E9B-Png/150/150/AvatarHeadshot/Png/noFilter" 
                        alt={currentUser}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-white">{currentUser}</h2>
                      <p className="text-xs text-gray-400">@00632Mo • ID: 4309585604</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button onClick={handleLogout} className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1">
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Сменить аккаунт</span>
                    </button>
                    <button onClick={() => setActiveTab('Avatar')} className="flex-1 sm:flex-none px-4 py-2 bg-[#23252c] hover:bg-[#2d3039] text-white text-xs font-bold rounded-lg border border-white/10 transition">
                      Edit avatar
                    </button>
                    <button onClick={() => setShowSettingsModal(true)} className="flex-1 sm:flex-none px-4 py-2 bg-[#23252c] hover:bg-[#2d3039] text-white text-xs font-bold rounded-lg border border-white/10 transition">
                      Edit profile
                    </button>
                    <a 
                      href={robloxProfileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 bg-[#23252c] hover:bg-[#2d3039] text-white rounded-lg border border-white/10 transition flex items-center justify-center"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Messages':
        return (
          <div className={`flex h-[600px] border rounded-lg overflow-hidden ${themeClasses.panel}`}>
            <div className="w-1/3 border-r p-4 font-bold">Входящие</div>
            <div className="w-2/3 p-6">
              <h3 className="text-xl font-bold mb-1">Система Roblox</h3>
              <p className="text-xs opacity-70 mb-6">Август 2026</p>
              <p className="text-sm">Добро пожаловать!</p>
            </div>
          </div>
        );

      case 'Friends':
        return (
          <section className="pb-20">
            <h2 className="text-2xl font-extrabold mb-6">Friends ({friends.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
              {friends.map(friend => (
                <div 
                  key={friend.name} 
                  onClick={() => {
                    setIsChatOpen(true);
                    setActiveChatUser(friend.name);
                  }}
                  className={`text-center p-4 rounded-lg border transition cursor-pointer ${themeClasses.card}`}
                >
                  <div className="w-20 h-20 mx-auto bg-gray-700 rounded-full mb-3 flex items-center justify-center overflow-hidden relative">
                    <User className="w-10 h-10 text-gray-300" />
                    {friend.online && <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-black bg-green-500"></span>}
                  </div>
                  <p className="font-bold text-sm truncate">{friend.name}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'Avatar':
        return (
          <div className="max-w-4xl mx-auto space-y-6 pb-24">
            <h2 className="text-2xl font-extrabold">Редактор Аватара</h2>
            <div className={`p-6 rounded-xl border flex flex-col md:flex-row items-center gap-6 ${themeClasses.panel}`}>
              <div className="w-64 h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border flex items-center justify-center relative overflow-hidden shadow-xl">
                <img 
                  src="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-BEEB9CE5D9B404987E987DA620302E9B-Png/150/150/AvatarHeadshot/Png/noFilter" 
                  alt="Avatar full"
                  className="w-full h-full object-cover scale-125"
                />
              </div>
            </div>
          </div>
        );

      case 'Inventory':
        return (
          <div className="max-w-5xl mx-auto space-y-6 pb-24">
            <h2 className="text-2xl font-extrabold">Инвентарь</h2>
          </div>
        );

      case 'Trade':
        return (
          <div className="max-w-4xl mx-auto space-y-6 pb-24">
            <h2 className="text-2xl font-extrabold">Трейды</h2>
          </div>
        );

      case 'Communities':
        return (
          <div className="max-w-5xl mx-auto space-y-6 pb-24">
            <h2 className="text-2xl font-extrabold">Сообщества</h2>
          </div>
        );

      default:
        return <div></div>;
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} font-sans flex flex-col selection:bg-gray-700`}>
      <header className={`h-12 border-b flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-40 ${themeClasses.header}`}>
        <div className="flex items-center space-x-6 text-sm font-semibold">
          <button onClick={() => { setActiveTab('Home'); setSearchQuery(''); }} className="flex items-center space-x-1 cursor-pointer">
            <span className="text-lg font-extrabold tracking-wider bg-white text-black px-1.5 py-0.5 rounded-sm">ROBLOX</span>
          </button>
          <nav className="hidden md:flex space-x-5 font-bold opacity-90 text-xs">
            <button onClick={() => { setActiveTab('Home'); setSearchQuery(''); }} className={`transition ${activeTab === 'Home' && !isSearching ? 'border-b-2 border-white pb-1' : 'hover:opacity-100'}`}>{t.home}</button>
            <button onClick={() => { setActiveTab('Charts'); setSearchQuery(''); }} className={`transition ${activeTab === 'Charts' && !isSearching ? 'border-b-2 border-white pb-1' : 'hover:opacity-100'}`}>{t.charts}</button>
            <button onClick={() => setActiveTab('Marketplace')} className="transition hover:opacity-100">{t.marketplace}</button>
            <button onClick={() => setActiveTab('Create')} className="transition hover:opacity-100">{t.create}</button>
            <button onClick={() => setShowRobuxModal(true)} className="transition hover:opacity-100">{t.robux}</button>
          </nav>
        </div>

        <div className="flex-1 max-w-sm mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs font-semibold rounded-md pl-3 pr-8 py-1.5 focus:outline-none transition ${themeClasses.input}`}
            />
            <Search className="absolute right-2.5 top-2 w-3.5 h-3.5 opacity-70" />
          </div>
        </div>

        <div className="flex items-center space-x-3 relative">
          <div className="flex items-center space-x-1 cursor-pointer" onClick={() => setActiveTab('Profile')}>
            <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-700">
              <img src="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-BEEB9CE5D9B404987E987DA620302E9B-Png/150/150/AvatarHeadshot/Png/noFilter" alt="avatar" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-bold hidden lg:inline">{currentUser}</span>
          </div>
          <button onClick={() => setShowRobuxModal(true)} className="flex items-center space-x-1 border border-[#393b3d] px-2 py-0.5 rounded text-xs">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-current flex items-center justify-center text-[9px] font-bold">R</div>
            <span className="font-bold">{robuxBalance}</span>
          </button>
          <button onClick={() => setShowSettingsModal(true)} className="transition">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex pt-12 flex-1">
        <aside className={`w-52 p-2 flex flex-col space-y-1 text-xs font-semibold border-r fixed left-0 top-12 bottom-0 overflow-y-auto hidden sm:flex z-30 ${themeClasses.sidebar}`}>
          <div onClick={() => { setActiveTab('Profile'); setSearchQuery(''); }} className="flex items-center px-3 py-2.5 mb-2 cursor-pointer hover:bg-black/10 rounded-md">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 mr-2.5 flex-shrink-0">
              <img src="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-BEEB9CE5D9B404987E987DA620302E9B-Png/150/150/AvatarHeadshot/Png/noFilter" alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="truncate"><p className="font-bold text-xs">{currentUser}</p></div>
          </div>

          <SidebarItem icon={<Home className="w-4 h-4"/>} label={t.home} active={activeTab === 'Home' && !isSearching} onClick={() => { setActiveTab('Home'); setSearchQuery(''); }} />
          <SidebarItem icon={<User className="w-4 h-4"/>} label={t.profile} active={activeTab === 'Profile' && !isSearching} onClick={() => { setActiveTab('Profile'); setSearchQuery(''); }} />
          <SidebarItem icon={<MessageSquare className="w-4 h-4"/>} label={t.messages} badge="6" active={activeTab === 'Messages' && !isSearching} onClick={() => { setActiveTab('Messages'); setSearchQuery(''); }} />
          <SidebarItem icon={<Users className="w-4 h-4"/>} label={t.friends} badge="19" active={activeTab === 'Friends' && !isSearching} onClick={() => { setActiveTab('Friends'); setSearchQuery(''); }} />
          <SidebarItem icon={<Smile className="w-4 h-4"/>} label={t.avatar} active={activeTab === 'Avatar'} onClick={() => setActiveTab('Avatar')} />
          <SidebarItem icon={<Package className="w-4 h-4"/>} label={t.inventory} active={activeTab === 'Inventory'} onClick={() => setActiveTab('Inventory')} />
          <SidebarItem icon={<Repeat className="w-4 h-4"/>} label={t.trade} active={activeTab === 'Trade'} onClick={() => setActiveTab('Trade')} />
          <SidebarItem icon={<Users2 className="w-4 h-4"/>} label={t.communities} active={activeTab === 'Communities'} onClick={() => setActiveTab('Communities')} />
        </aside>

        <main className="flex-1 sm:ml-52 p-6 overflow-y-auto relative min-h-[calc(100vh-3rem)]">
          {renderContent()}
        </main>
      </div>

      {/* МОДАЛЬНОЕ ОКНО РЕГИСТРАЦИИ / АВТОРИЗАЦИИ */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className={`border rounded-xl max-w-md w-full overflow-hidden shadow-2xl relative flex flex-col ${themeClasses.panel}`}>
            {isLoggedIn && (
              <button onClick={() => setIsAuthOpen(false)} className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black text-white rounded-full transition z-10">
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="p-6 border-b bg-gradient-to-r from-emerald-950/50 to-black text-center">
              <div className="inline-block bg-white text-black font-black text-xl px-2 py-0.5 rounded mb-2 tracking-wider">ROBLOX</div>
              <h2 className="text-2xl font-extrabold">{authMode === 'register' ? 'Регистрация аккаунта' : 'Вход в аккаунт'}</h2>
              <p className="text-xs opacity-70 mt-1">Создайте профиль, чтобы сохранять прогресс уровней</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
              <div className="flex bg-black/20 p-1 rounded-lg mb-4 border border-white/5">
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 rounded-md text-xs font-bold transition flex items-center justify-center space-x-1 ${authMode === 'register' ? 'bg-[#00b06f] text-white shadow' : 'opacity-70 hover:opacity-100'}`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Регистрация</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 rounded-md text-xs font-bold transition flex items-center justify-center space-x-1 ${authMode === 'login' ? 'bg-[#00b06f] text-white shadow' : 'opacity-70 hover:opacity-100'}`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Войти</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold opacity-80 mb-1">Имя пользователя (Никнейм)</label>
                <input
                  type="text"
                  required
                  placeholder="Например: YotouUxxdds"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className={`w-full text-xs font-semibold rounded-lg px-3 py-2.5 focus:outline-none border ${themeClasses.input}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold opacity-80 mb-1">Пароль</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full text-xs font-semibold rounded-lg px-3 py-2.5 focus:outline-none border ${themeClasses.input}`}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#00b06f] hover:bg-[#009c62] text-white font-extrabold py-3 rounded-lg text-sm transition shadow-lg mt-2"
              >
                {authMode === 'register' ? 'Зарегистрироваться' : 'Войти в игру'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* МОДАЛЬНОЕ ОКНО ВЫБОРА УРОВНЕЙ И ИГРЫ */}
      {selectedGame && !isPlaying && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className={`border rounded-lg max-w-3xl w-full overflow-hidden shadow-2xl relative flex flex-col ${themeClasses.panel} max-h-[90vh]`}>
            <button onClick={() => setSelectedGame(null)} className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black text-white rounded-full transition z-10">
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 border-b bg-gradient-to-r from-red-950/40 to-black">
              <h2 className="text-2xl font-extrabold mb-1">{selectedGame.title}</h2>
              <p className="text-xs opacity-70">От <span className="font-bold">{selectedGame.creator}</span> • Выберите уровень для погружения</p>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-red-500">Доступные уровни (1 - 10)</h3>
                <button 
                  onClick={() => {
                    if (confirm("Сбросить весь прогресс уровней?")) {
                      setMaxUnlockedLevel(1);
                      localStorage.setItem('roblox_maxLevel', '1');
                    }
                  }} 
                  className="text-[10px] text-red-400 hover:underline"
                >
                  Сбросить прогресс
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((lvl) => {
                  const isLocked = lvl === 10 ? maxUnlockedLevel < 10 : lvl > maxUnlockedLevel;
                  const currentCfg = getLevelConfig(lvl);
                  return (
                    <div
                      key={lvl}
                      onClick={() => {
                        if (!isLocked) startLevel(lvl);
                      }}
                      className={`p-4 rounded-lg border flex flex-col items-center justify-center transition relative ${
                        isLocked 
                          ? 'opacity-40 bg-black/40 border-gray-800 cursor-not-allowed' 
                          : 'cursor-pointer hover:border-red-500 hover:bg-red-950/20 bg-black/20 border-white/10'
                      }`}
                    >
                      {isLocked && <Lock className="absolute top-2 right-2 w-4 h-4 text-red-400" />}
                      {!isLocked && lvl < maxUnlockedLevel && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-green-500" />}
                      
                      <span className="text-xl font-black mb-1">Ур. {lvl}</span>
                      <span className="text-[11px] opacity-70 text-center">💀 {currentCfg.target} черепов</span>
                      <span className="text-[10px] opacity-50 mt-1">{lvl === 10 ? '🔥 Экстрим' : lvl >= 8 ? '⚡ Хардкор' : '🌲 Обычный'}</span>
                    </div>
                  );
                })}
              </div>
              {maxUnlockedLevel < 10 && (
                <p className="text-xs text-yellow-500/90 bg-yellow-500/10 p-3 rounded border border-yellow-500/20">
                  🔒 Чтобы разблокировать секретный 10 уровень («Экстрим»), вам необходимо последовательно пройти уровни с 1 по 9!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ИГРОВОЙ ЭКРАН И МЕНЮ УСПЕХА/ПОРАЖЕНИЯ */}
      {isPlaying && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center cursor-crosshair">
          <div ref={containerRef} className="absolute inset-0 w-full h-full" />

          <div className="absolute top-4 left-6 right-6 flex justify-between items-center pointer-events-none text-white font-bold z-10">
            <div className="flex items-center space-x-3 bg-black/60 px-4 py-2 rounded-lg backdrop-blur border border-white/10 flex-wrap gap-2">
              <span className="text-sm text-red-400">🔥 Уровень {selectedLevel}</span>
              <span className="bg-yellow-500/25 border border-yellow-500 px-3 py-1 rounded text-yellow-400 text-xs">
                💀 Черепки: {score} / {getLevelConfig(selectedLevel).target}
              </span>
              <span className="text-xs opacity-80">Фонарик [F]: <span className={flashlightOn ? "text-green-400" : "text-red-400"}>{flashlightOn ? "ВКЛ" : "ВЫКЛ"}</span></span>
              {getLevelConfig(selectedLevel).staminaMax !== Infinity && (
                <span className="text-xs bg-blue-500/20 border border-blue-500/50 px-2 py-0.5 rounded text-blue-300">
                  ⚡ Стамина: {staminaPercent}% ({staminaStateText})
                </span>
              )}
            </div>
            
            <button 
              onClick={() => setIsPlaying(false)} 
              className="pointer-events-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition shadow-lg"
            >
              Выйти в меню
            </button>
          </div>

          <div className="absolute bottom-6 text-center pointer-events-none text-white/60 text-xs bg-black/60 px-4 py-2 rounded border border-white/10">
            <strong className="text-white">WASD</strong> — ходить, <strong className="text-white">Shift</strong> — бежать, мышь — во все стороны, <strong className="text-white">F</strong> — вкл/выкл фонарик, <strong className="text-yellow-400">/</strong> — курсор мыши.
          </div>

          {levelCompleted && (
            <div className="absolute inset-0 bg-emerald-950/95 flex flex-col items-center justify-center text-center p-6 z-20 animate-fadeIn">
              <div className="text-7xl mb-4">🏆</div>
              <h2 className="text-5xl font-extrabold text-emerald-400 mb-2 tracking-widest drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">УРОВЕНЬ ПРОЙДЕН!</h2>
              <p className="text-md text-gray-200 mb-6">Вы успешно собрали все черепки на уровне {selectedLevel}!</p>
              <div className="flex space-x-4">
                {selectedLevel < 10 ? (
                  <button 
                    onClick={() => startLevel(selectedLevel + 1)} 
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition shadow-lg"
                  >
                    Следующий уровень (Ур. {selectedLevel + 1})
                  </button>
                ) : (
                  <div className="text-yellow-400 font-extrabold text-lg mb-2">🎉 Вы прошли абсолютный экстрим игры!</div>
                )}
                <button 
                  onClick={() => { setIsPlaying(false); setSelectedGame(null); }} 
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg text-sm transition"
                >
                  Главное меню
                </button>
              </div>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 bg-red-950/95 flex flex-col items-center justify-center text-center p-6 z-20 animate-pulse">
              <div className="text-8xl mb-4">😱</div>
              <h2 className="text-6xl font-extrabold text-red-500 mb-2 tracking-widest drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">ВАС СЪЕЛИ!</h2>
              <p className="text-md text-gray-200 mb-6">Собрано черепов: <span className="text-yellow-400 font-bold text-2xl">{score}</span> / {getLevelConfig(selectedLevel).target}</p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => startLevel(selectedLevel)} 
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition shadow-lg"
                >
                  Попробовать снова
                </button>
                <button 
                  onClick={() => { setIsPlaying(false); setSelectedGame(null); }} 
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg text-sm transition"
                >
                  Главное меню
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showRobuxModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className={`border rounded-lg p-6 max-w-sm w-full text-center relative shadow-lg ${themeClasses.panel}`}>
            <button onClick={() => setShowRobuxModal(false)} className="absolute top-3 right-3"><X className="w-5 h-5" /></button>
            <h3 className="text-2xl font-extrabold mb-2">Купить Robux</h3>
            <button 
              onClick={() => { setRobuxBalance(prev => prev + 400); setShowRobuxModal(false); }}
              className="w-full bg-[#00b06f] text-white font-extrabold py-3 rounded-md mt-4 transition"
            >
              Купить 400 R$
            </button>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className={`border rounded-lg p-6 max-w-md w-full relative ${themeClasses.panel}`}>
            <button onClick={() => setShowSettingsModal(false)} className="absolute top-3 right-3"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-bold mb-6">Настройки</h3>
            
            <div className="space-y-6 text-sm font-semibold">
              <div className="flex justify-between items-center pb-4 border-b">
                <span>Тема</span>
                <div className="flex space-x-1 bg-black/10 p-1 rounded-md">
                  {(['Dark', 'Light', 'Classic'] as const).map((thm) => (
                    <button
                      key={thm}
                      onClick={() => setCurrentTheme(thm)}
                      className={`px-3 py-1 rounded text-xs transition ${currentTheme === thm ? 'bg-[#00b06f] text-white font-bold' : 'opacity-70 hover:opacity-100'}`}
                    >
                      {thm}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setShowSettingsModal(false)} className="w-full bg-[#00b06f] text-white py-2 rounded-md transition font-bold">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`fixed bottom-0 right-4 rounded-t-lg text-sm border transition-all duration-300 z-50 ${isChatOpen ? 'w-80 h-96 shadow-2xl' : 'w-48 h-10 shadow-lg'} ${themeClasses.panel}`}>
        <div 
          onClick={() => !activeChatUser && setIsChatOpen(!isChatOpen)} 
          className="flex justify-between items-center px-4 py-2 font-bold cursor-pointer border-b"
        >
          <div className="flex items-center">
            {isChatOpen && activeChatUser && (
              <button onClick={(e) => { e.stopPropagation(); setActiveChatUser(null); }} className="mr-2 p-1">
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <span className="truncate max-w-[150px]">{activeChatUser ? activeChatUser : 'Chat'}</span>
          </div>
          {isChatOpen && (
            <button onClick={(e) => { e.stopPropagation(); setIsChatOpen(false); setActiveChatUser(null); }}><X className="w-4 h-4" /></button>
          )}
        </div>
        
        {isChatOpen && (
          <div className="h-[calc(100%-40px)] flex flex-col">
            {!activeChatUser ? (
              <div className="overflow-y-auto p-2 space-y-1 h-full">
                {friends.map(friend => (
                  <div key={friend.name} onClick={() => setActiveChatUser(friend.name)} className="flex items-center p-2 hover:bg-black/10 rounded cursor-pointer transition">
                    <div className="w-8 h-8 bg-gray-600 rounded-full mr-3 flex items-center justify-center font-bold text-xs text-white">
                      {friend.name.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-xs">{friend.name}</p>
                      <p className={`text-[10px] ${friend.online ? 'text-green-500' : 'opacity-50'}`}>{friend.online ? 'В сети' : 'Не в сети'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="overflow-y-auto p-3 space-y-3 flex-1 flex flex-col justify-end">
                  {(chatHistories[activeChatUser] || []).map((msg, idx) => (
                    <div key={idx} className={`max-w-[85%] rounded p-2 text-xs ${msg.sender === 'Вы' ? 'bg-[#00b06f] text-white self-end ml-auto' : 'bg-black/20 self-start'}`}>
                      <span style={{ wordBreak: 'break-word' }}>{msg.text}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t flex items-center space-x-2">
                  <input 
                    type="text" 
                    placeholder="Сообщение..." 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className={`w-full rounded px-3 py-1.5 text-xs focus:outline-none ${themeClasses.input}`}
                  />
                  <button onClick={handleSendMessage} className="bg-[#00b06f] p-1.5 rounded"><Send className="w-3 h-3 text-white" /></button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, badge, active, onClick }: { icon: React.ReactNode, label: string, badge?: string, active?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition ${active ? 'bg-black/20 font-bold' : 'opacity-70 hover:opacity-100 hover:bg-black/10'}`}>
      <div className="flex items-center">
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </div>
      {badge && <span className="text-[10px] bg-gray-700 px-1.5 py.5 rounded-full font-bold">{badge}</span>}
    </button>
  );
}

function GameCard({ item, onClick, theme }: { item: GameItem, onClick: () => void, theme: any }) {
  return (
    <div onClick={onClick} className={`group cursor-pointer rounded-lg transition border overflow-hidden shadow-sm ${theme.card}`}>
      <div className="relative aspect-video bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-900 flex items-center justify-center p-4">
        <Play className="w-10 h-10 text-white opacity-80 group-hover:scale-110 transition duration-200" />
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm truncate">{item.title}</h3>
        <div className="flex items-center justify-between mt-2 opacity-70 text-xs font-semibold">
          <span className="flex items-center text-green-400"><ThumbsUp className="w-3 h-3 mr-1" /> {item.rating} Rating</span>
        </div>
      </div>
    </div>
  );
}
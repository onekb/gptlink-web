import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MoonIcon, Sun, Laptop, Languages, Github } from 'lucide-react';

import { useAppStore, ThemeModeType, LanguagesType, useUserStore, ModelType } from '@/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from '@/components/ui/select';

export const ThemeMode = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useAppStore((state) => [state.theme, state.setTheme]);

  const switchTheme = (mode: ThemeModeType) => {
    setTheme(mode);
  };

  const getIcon = (item: ThemeModeType, size = 14) => {
    const iconMap = {
      [ThemeModeType.LIGHT]: <Sun size={size} />,
      [ThemeModeType.DARK]: <MoonIcon size={size} />,
      [ThemeModeType.SYSTEM]: <Laptop size={size} />,
    };
    return iconMap[item];
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 w-9 p-0">
          {getIcon(theme, 18)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'end'} className="w-32">
        {[ThemeModeType.LIGHT, ThemeModeType.DARK, ThemeModeType.SYSTEM].map((item) => (
          <DropdownMenuItem className="flex items-center gap-2" key={item} onClick={() => switchTheme(item)}>
            {getIcon(item)} {t(item)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const SystemLanguages = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useAppStore((state) => [state.language, state.setLanguage]);

  const switchLanguage = (mode: LanguagesType) => {
    localStorage.setItem('language-mode', mode);
    i18n.changeLanguage(mode);
    setLanguage(mode);
  };

  useEffect(() => {
    switchLanguage(language);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 w-9 p-0">
          <Languages size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'end'}>
        <DropdownMenuRadioGroup value={language} onValueChange={(val) => switchLanguage(val as LanguagesType)}>
          {[LanguagesType.ZH, LanguagesType.EN].map((item) => (
            <DropdownMenuRadioItem className="flex items-center gap-2" value={item} key={item}>
              {t(item)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ModelSelect = () => {
  const [model, setModel] = useAppStore((state) => [state.model, state.setModel])

  const switchModel = (mode: ModelType) => {
    localStorage.setItem('model-mode', mode);
    setModel(mode);
  };

  useEffect(() => {
    switchModel(model);
  }, [])

  return (
    <Select onValueChange={(value: ModelType) => switchModel(value)} defaultValue={model}>
      <SelectTrigger>
        <SelectValue placeholder="请选择模型" />
      </SelectTrigger>
      <SelectContent className='bg-primary'>
        <SelectGroup>
          <SelectLabel>OpenAI</SelectLabel>
          <SelectItem disabled={true} value={ModelType.GPT4}>GPT-4</SelectItem>
          <SelectItem value={ModelType.GPT35}>GPT-3.5</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>智谱AI</SelectLabel>
          <SelectItem value={ModelType.ChatGLMPro}>ChatGLM-Pro</SelectItem>
          <SelectItem value={ModelType.ChatGLMStd}>ChatGLM-Std</SelectItem>
          <SelectItem value={ModelType.ChatGLMLite}>ChatGLM-Lite</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}



const UserDropDown = () => {
  const navigate = useNavigate();
  const [appConfig] = useAppStore((state) => [state.appConfig]);
  const [{ nickname, avatar }, signOut, isLogin] = useUserStore((state) => [
    state.userInfo,
    state.signOut,
    state.isLogin(),
  ]);
  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <>
      {isLogin ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatar || appConfig.user_logo} alt={nickname} />
                <AvatarFallback>{nickname.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <p className="ml-2">{nickname}</p>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={'end'}>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => {
                navigate('/user');
              }}
            >
              个人中心
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleSignOut()}>
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => navigate('/login')} style={{ whiteSpace: 'nowrap' }}>去登陆</Button>
      )}
    </>
  );
};

export default function Header({ isPlain = false }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [appConfig, theme, setTheme] = useAppStore((state) => [state.appConfig, state.theme, state.setTheme]);

  const handleNavToChat = () => {
    navigate('/chat');
  };

  const location = useLocation();

  const navList = [
    {
      path: 'user',
      name: t('user center'),
    },
    {
      path: 'billing',
      name: t('billing center'),
    },
  ];

  useEffect(() => {
    setTheme(theme);
  }, []);

  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center">
        <button className="flex items-center gap-2 text-lg font-semibold" onClick={() => handleNavToChat()}>
          <img src={appConfig.web_logo} className="h-10 w-10 rounded-full" />
          {appConfig.name}
        </button>
        {!isPlain && (
          <>
            <Separator className="mx-4 h-6" orientation="vertical" />
            {navList.map((item, index) => (
              <Link to={item.path} key={index}>
                <Button className="mr-1" variant={location.pathname.includes(item.path) ? 'default' : 'ghost'}>
                  {item.name}
                </Button>
              </Link>
            ))}
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ModelSelect />
        <Link to="https://github.com/gptlink/gptlink-web" target="_blank">
          <Button variant="ghost" className="p-0 px-2">
            <Github size={18} />
          </Button>
        </Link>
        <ThemeMode />
        {!isPlain && <UserDropDown />}
      </div>
    </div>
  );
}

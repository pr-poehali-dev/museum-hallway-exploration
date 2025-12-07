import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Exhibit {
  id: number;
  name: string;
  era: string;
  description: string;
  audioGuide: string;
  position: number;
  images: string[];
  detailedInfo: string;
}

const exhibits: Exhibit[] = [
  {
    id: 1,
    name: 'Меч викингов',
    era: 'IX век н.э.',
    description: 'Боевой меч скандинавских воинов с рукоятью из позолоченной бронзы',
    audioGuide: 'Этот меч был найден в захоронении знатного викинга. Орнамент на рукояти указывает на высокий статус владельца.',
    position: 1,
    images: ['https://images.unsplash.com/photo-1516407880455-75f8c75c3a84?w=800', 'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=800'],
    detailedInfo: 'Длина клинка: 85 см. Вес: 1.2 кг. Материал: высокоуглеродистая сталь с узором дамаска.'
  },
  {
    id: 2,
    name: 'Древнегреческая амфора',
    era: 'V век до н.э.',
    description: 'Краснофигурная керамическая амфора с изображением мифологических сцен',
    audioGuide: 'Амфора использовалась для хранения вина и масла. Роспись выполнена в афинском стиле и изображает подвиги Геракла.',
    position: 2,
    images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800', 'https://images.unsplash.com/photo-1582561833392-13840f1e2bbe?w=800'],
    detailedInfo: 'Высота: 42 см. Обжиг в печи при температуре 1000°C. Найдена в Афинах в 1923 году.'
  },
  {
    id: 3,
    name: 'Египетский скарабей',
    era: 'XIV век до н.э.',
    description: 'Золотой амулет-скарабей с иероглифами времён фараона Тутанхамона',
    audioGuide: 'Скарабей символизировал воскрешение и вечную жизнь. Носился как защитный амулет знатными египтянами.',
    position: 3,
    images: ['https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800', 'https://images.unsplash.com/photo-1567696153798-96f42c676e6e?w=800'],
    detailedInfo: 'Материал: сплав золота 750 пробы. Вес: 15 грамм. Обнаружен в гробнице KV62.'
  },
  {
    id: 4,
    name: 'Римский гладиус',
    era: 'II век н.э.',
    description: 'Короткий меч римского легионера с характерной прямой формой клинка',
    audioGuide: 'Гладиус был основным оружием римской пехоты. Этот экземпляр принадлежал центуриону III легиона.',
    position: 4,
    images: ['https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=800', 'https://images.unsplash.com/photo-1516407880455-75f8c75c3a84?w=800'],
    detailedInfo: 'Длина: 65 см. Двусторонняя заточка. Найден близ Адрианова вала в Британии.'
  },
  {
    id: 5,
    name: 'Славянская керамика',
    era: 'X век н.э.',
    description: 'Глиняный горшок с орнаментом древних славян',
    audioGuide: 'Эта посуда использовалась в быту для хранения зерна. Узоры несли сакральный смысл и защищали от злых духов.',
    position: 5,
    images: ['https://images.unsplash.com/photo-1582561833392-13840f1e2bbe?w=800', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'],
    detailedInfo: 'Высота: 28 см. Обнаружен при раскопках в Новгороде. Возраст подтверждён радиоуглеродным анализом.'
  }
];

export default function Index() {
  const [showIntro, setShowIntro] = useState(true);
  const [position, setPosition] = useState(0);
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const audioRef = useRef<HTMLDivElement>(null);

  const playAudioGuide = (text: string) => {
    setIsPlayingAudio(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopAudioGuide = () => {
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
  };

  const moveForward = () => {
    if (position < 5) setPosition(position + 1);
  };

  const moveBackward = () => {
    if (position > 0) setPosition(position - 1);
  };

  const getVisibleExhibits = () => {
    return exhibits.filter(ex => {
      const distance = Math.abs(ex.position - position);
      return distance <= 2;
    });
  };

  const getExhibitScale = (exhibitPosition: number) => {
    const distance = Math.abs(exhibitPosition - position);
    if (distance === 0) return 1;
    if (distance === 1) return 0.7;
    if (distance === 2) return 0.4;
    return 0;
  };

  const getExhibitOpacity = (exhibitPosition: number) => {
    const distance = Math.abs(exhibitPosition - position);
    if (distance === 0) return 1;
    if (distance === 1) return 0.6;
    if (distance === 2) return 0.3;
    return 0;
  };

  useEffect(() => {
    return () => {
      stopAudioGuide();
    };
  }, []);

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] via-[#2C2416] to-[#1A1F2C] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMTIsIDE3NSwgNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="text-center space-y-8 animate-fade-in relative z-10">
          <div className="space-y-2">
            <Icon name="Landmark" size={80} className="mx-auto text-primary animate-scale-in" />
            <h1 className="text-7xl font-bold text-primary tracking-wide">
              ИСТОРИЧЕСКИЙ МУЗЕЙ
            </h1>
            <p className="text-2xl text-muted-foreground font-light tracking-widest">
              Путешествие сквозь эпохи
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-4 text-foreground/80">
            <p className="text-lg leading-relaxed">
              Добро пожаловать в виртуальный музей древних артефактов. 
              Вы сможете перемещаться по коридору, рассматривать экспонаты 
              и слушать аудиогид о каждом предмете.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <Icon name="ArrowLeft" size={16} className="text-primary" />
                <Icon name="ArrowRight" size={16} className="text-primary" />
                <span>Навигация</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Eye" size={16} className="text-primary" />
                <span>Детальный осмотр</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Volume2" size={16} className="text-primary" />
                <span>Аудиогид</span>
              </div>
            </div>
          </div>

          <Button 
            size="lg" 
            className="text-lg px-12 py-6 hover-scale"
            onClick={() => setShowIntro(false)}
          >
            <Icon name="DoorOpen" size={24} className="mr-2" />
            Войти в музей
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] via-[#2C2416] to-[#1A1F2C] relative overflow-hidden">
      <div className="absolute top-4 left-4 z-50">
        <Card className="p-4 bg-card/90 backdrop-blur">
          <div className="text-sm text-muted-foreground">
            Позиция: {position} / 5
          </div>
        </Card>
      </div>

      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

      <div className="relative min-h-screen flex items-center justify-center perspective-1000">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(212, 175, 55, 0.03) 0%, transparent 50%, rgba(212, 175, 55, 0.03) 100%)',
          backgroundSize: '100% 200px'
        }}></div>

        <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-gradient-to-r from-[#2C2416]/60 to-transparent border-r border-primary/10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-[#2C2416]/60 to-transparent border-l border-primary/10"></div>

        <div className="relative w-full max-w-7xl mx-auto px-4 py-20">
          <div className="relative h-[600px] flex items-center justify-center">
            {getVisibleExhibits().map((exhibit) => {
              const relativePos = exhibit.position - position;
              const scale = getExhibitScale(exhibit.position);
              const opacity = getExhibitOpacity(exhibit.position);
              const translateY = Math.abs(relativePos) * 20;
              
              return (
                <div
                  key={exhibit.id}
                  className="absolute transition-all duration-700 ease-out cursor-pointer hover-scale"
                  style={{
                    transform: `translateX(${relativePos * 300}px) translateY(${translateY}px) scale(${scale})`,
                    opacity: opacity,
                    zIndex: 10 - Math.abs(relativePos)
                  }}
                  onClick={() => relativePos === 0 && setSelectedExhibit(exhibit)}
                >
                  <Card className="w-80 h-96 bg-card/95 backdrop-blur border-2 border-primary/30 shadow-2xl overflow-hidden group">
                    <div className="h-full p-6 flex flex-col">
                      <div className="flex-1 flex items-center justify-center mb-4 relative overflow-hidden rounded-lg bg-muted/20">
                        <img 
                          src={exhibit.images[0]} 
                          alt={exhibit.name}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold text-primary">{exhibit.name}</h3>
                        <p className="text-sm text-muted-foreground">{exhibit.era}</p>
                        {relativePos === 0 && (
                          <div className="pt-2 flex justify-center gap-2 animate-fade-in">
                            <Icon name="Eye" size={20} className="text-primary animate-pulse" />
                            <span className="text-sm text-primary">Нажмите для просмотра</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-50">
        <Button
          size="lg"
          variant="secondary"
          onClick={moveBackward}
          disabled={position === 0}
          className="bg-card/90 backdrop-blur hover:bg-primary hover:text-primary-foreground"
        >
          <Icon name="ArrowLeft" size={24} className="mr-2" />
          Назад
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={moveForward}
          disabled={position === 5}
          className="bg-card/90 backdrop-blur hover:bg-primary hover:text-primary-foreground"
        >
          Вперёд
          <Icon name="ArrowRight" size={24} className="ml-2" />
        </Button>
      </div>

      <Dialog open={!!selectedExhibit} onOpenChange={() => {
        setSelectedExhibit(null);
        setCurrentImageIndex(0);
        stopAudioGuide();
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedExhibit && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl text-primary">{selectedExhibit.name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted/20">
                  <img 
                    src={selectedExhibit.images[currentImageIndex]} 
                    alt={selectedExhibit.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {selectedExhibit.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          idx === currentImageIndex ? 'bg-primary scale-125' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Эпоха</h4>
                    <p className="text-lg">{selectedExhibit.era}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Описание</h4>
                    <p className="text-base leading-relaxed">{selectedExhibit.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Детали</h4>
                    <p className="text-base leading-relaxed">{selectedExhibit.detailedInfo}</p>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                        <Icon name="Volume2" size={18} />
                        Аудиогид
                      </h4>
                      <Button
                        variant={isPlayingAudio ? "destructive" : "default"}
                        size="sm"
                        onClick={() => isPlayingAudio ? stopAudioGuide() : playAudioGuide(selectedExhibit.audioGuide)}
                      >
                        {isPlayingAudio ? (
                          <>
                            <Icon name="Square" size={16} className="mr-2" />
                            Остановить
                          </>
                        ) : (
                          <>
                            <Icon name="Play" size={16} className="mr-2" />
                            Прослушать
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground italic">{selectedExhibit.audioGuide}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

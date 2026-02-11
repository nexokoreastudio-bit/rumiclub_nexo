import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { isDebug, debugLog, safeStringify } from './utils/debug';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const videos = [
  { id: 'hSFAHFgniVU', title: '선 연결 없는 전자칠판? 3초 만에 무선 미러링', desc: '케이블 없이 스마트폰/태블릿을 3초 만에 연결하는 방법' },
  { id: 'bLcOVmdYWzM', title: '선생님들이 진짜 좋아하는 기능 1위! 폰 쉐어', desc: '사진 찍어 바로 칠판으로 보내는 편리한 기능' },
  { id: 'Ofl5GWPY2lQ', title: '구방정식, 1초 만에 3D로 보여주는 전자칠판', desc: '수학 문제를 3D로 시각화하는 혁신적인 기능' },
  { id: '9EZRDCEK7fk', title: '아직도 화면 따로, 판서 따로? 1초 만에 끝내는 스마트 수업', desc: '화면과 판서를 동시에 보여주는 효율적인 수업 방법' },
  { id: 'YJJI_iTNKaA', title: '전자칠판 지문 자국, 새것처럼 변하는 관리 팁', desc: '전자칠판을 새것처럼 관리하는 꿀팁' },
  { id: 'DycCGxWEzeM', title: '전자칠판 사용법, 넥소 하나로 종결', desc: '넥소 전자칠판의 모든 기능을 한눈에 보는 가이드' },
];

const aiFeatures = [
  { icon: 'fa-comments', title: '채팅, 지능형 비서', desc: '채팅 모드로 AI와 대화하며 수업 자료를 준비하세요.' },
  { icon: 'fa-question-circle', title: 'QA 질문 생성', desc: '키워드를 입력하고 필요한 옵션을 선택하여 원하는 QA 질문을 생성합니다.' },
  { icon: 'fa-language', title: '다국어 번역', desc: '동일 화면에서 최대 4개 언어 동시 번역을 지원합니다.' },
  { icon: 'fa-file-lines', title: '문서 분석', desc: '업로드한 문서를 AI가 분석하여 핵심 내용을 요약해드립니다.' },
  { icon: 'fa-graduation-cap', title: '교육 계획 생성', desc: '핵심 정보를 입력하고 적절한 옵션을 선택하여 다양한 요구에 맞는 교육 계획을 생성합니다.' },
];

const koreanFeatures = [
  { icon: 'fa-highlighter', title: '지문 분석 특화 도구', desc: '형광펜과 밑줄로 핵심 문장을 즉시 표시하고, 긴 지문 위에 바로 구조 분석 도형을 삽입할 수 있습니다.' },
  { icon: 'fa-layer-group', title: '무한 판서 & 편집', desc: '지우개 가루 없이 무한대로 쓰고 지우세요. 이미지와 영상을 자유롭게 배치하여 창의적인 수업이 가능합니다.' },
  { icon: 'fa-pen-nib', title: '국어 수업 특화 기능', desc: '문단 구조 분석, 논리 흐름 도식화, 어휘 하이라이트 등 국어 지문 분석에 최적화된 도구를 제공합니다.' },
];

const bentoItems = [
  { large: false, title: '4K UHD 해상도', body: '가장 뒷자리 학생에게도 선명한 지문 전달. 작은 글씨까지 완벽하게 보입니다.' },
  { large: false, title: 'Android 13', body: 'PC 연결 없이도 웹 브라우징과 문서 열람 가능. 모든 수업 준비를 하나의 기기에서.', highlight: true },
  { large: false, title: '50포인트 터치', body: '여러 학생이 동시에 칠판에 필기할 수 있는 멀티터치 지원. 협업 학습이 가능합니다.' },
  { large: true, title: '원클릭 QR 공유', body: '오늘 수업한 모든 판서 내용, 사진 찍을 필요 없이 QR코드 하나로 학생 폰에 즉시 전송. 복습 자료 준비 시간이 필요 없습니다.', img: 'QR.png' },
  { large: false, title: '2ms 반응속도', body: '실제 펜과 같은 자연스러운 필기감. 지연 없는 부드러운 판서 경험.' },
];

const whyNexoFeatures = [
  { icon: 'fa-eye', title: '무반사(최상위등급) & Zero-Bonding', desc: '완전 제로 반사, 고강도 강화유리의 시인성 및 필기감' },
  { icon: 'fa-mobile-screen-button', title: '폰 공유 솔루션 (PHONE SHARE)', desc: '교육/회의 환경에서 실시간 사진·영상 공유. 학습 자료를 전자칠판에 즉시 표시하는 Quick SHARE' },
  { icon: 'fa-wifi', title: 'Smart Connectivity', desc: '실시간 무선 화면 미러링 (양방향 제어 지원)' },
  { icon: 'fa-layer-group', title: 'Usability', desc: '간편한 QR코드 생성/공유, 멀티태스킹 분할 화면' },
  { icon: 'fa-microchip', title: 'NX Series 독점 사양', desc: 'Android 13.0 (15.0 Up), Octa-Core, RAM 16GB / ROM 256GB 등 고사양 스펙' },
  { icon: 'fa-sliders', title: '사용자별 맞춤설정 (임계값)', desc: '다양한 펜 종류 지원, 각 사용자별 임계값 조정으로 얇은 글씨와 두꺼운 글씨를 편리하게 설정 가능' },
];

const productSpecs = [
  { icon: 'fa-eye', title: '디스플레이', spec: '무반사(최상위등급) & Zero-Bonding / 완전 제로 반사 + 9H 경도 강화유리', description: '형광등 아래서도 선명한 시인성, 완벽한 필기감, 스크래치 방지' },
  { icon: 'fa-video', title: '사운드 & 마이크 & 카메라', spec: '48MP AI Camera + 8 어레이 마이크 내장', description: '별도 장비 없이 목소리와 판서 화면 동시 녹화 가능' },
  { icon: 'fa-microchip', title: '시스템 사양', spec: 'Android 13.0 (15.0 Up) / Octa-Core / RAM 16GB / ROM 256GB', description: '국어, 수학, 영어, 과학, 논술까지 모든 과목을 완벽 지원하는 압도적 고사양 스펙' },
];

const productLineup = [
  { size: '65"', label: '65인치', recommended: false, specs: { cpu: 'Octa-Core', os: 'Android 13.0 (15.0 Up)', memory: '16GB / 256GB', brightness: '450nits', audio: '20W x 2 + Subwoofer', connectivity: 'Wi-Fi 6, NFC, 대화형 AI, 지문인식' } },
  { size: '75"', label: '75인치', recommended: true, specs: { cpu: 'Octa-Core', os: 'Android 13.0 (15.0 Up)', memory: '16GB / 256GB', brightness: '450nits', audio: '20W x 2 + Subwoofer', connectivity: 'Wi-Fi 6, NFC, 대화형 AI, 지문인식' } },
  { size: '86"', label: '86인치', recommended: false, specs: { cpu: 'Octa-Core', os: 'Android 13.0 (15.0 Up)', memory: '16GB / 256GB', brightness: '450nits', audio: '20W x 2 + Subwoofer', connectivity: 'Wi-Fi 6, NFC, 대화형 AI, 지문인식' } },
];

const lineupSpecLabels = { cpu: 'CPU:', os: 'OS:', memory: 'Memory/Storage:', brightness: 'Brightness:', audio: 'Audio:', connectivity: 'Connectivity:' };

const newStandardFeatures = [
  { icon: 'fa-chalkboard-teacher', title: '학원 수업', desc: '펜, 도형, 지우개, 수학·국어 도구로 직관적인 수업 진행' },
  { icon: 'fa-video', title: '온라인 강의', desc: '무반사 화면으로 빛 반사 없이 선명한 강의 녹화' },
  { icon: 'fa-mobile-screen-button', title: '학생 미러링', desc: '9대 디바이스 동시 연결로 학생 발표 및 참여 유도' },
  { icon: 'fa-robot', title: 'AI 학습 지원', desc: '실시간 Q&A, 국어·수학 풀이, 다국어 학습 AI 지원' },
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMountType, setSelectedMountType] = useState('wall');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const orderFormRef = useRef(null);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    console.log('[특가주문] 제출 버튼 클릭됨 — 핸들러 실행');

    const agree = document.getElementById('privacy-agree');
    if (!agree.checked) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    const form = e.target;
    const formData = new FormData(form);
    const size = formData.get('size');
    const quantity = formData.get('quantity');
    if (!size || !quantity) {
      console.warn('[특가주문] 인치 또는 수량 미선택', { size, quantity });
      alert('인치 종류와 구매 수량을 선택해주세요.');
      return;
    }

    // 로컬 테스트 모드 (localhost에서는 콘솔 출력)
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
      console.log('📋 [로컬 테스트] 폼 데이터:');
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
      }
      alert('✅ [로컬 테스트] 폼 데이터가 콘솔에 출력되었습니다.\n배포 환경에서는 Google Sheets + Netlify Forms로 전송됩니다.');
      form.reset();
      setSelectedSize('');
      setSelectedMountType('wall');
      setSelectedQuantity('');
      return;
    }

    const formDataObj = {
      customer_name: formData.get('customer_name') || '',
      org_name: formData.get('org_name') || '',
      phone_number: formData.get('phone_number') || '',
      region: formData.get('region') || '',
      size: formData.get('size') || '',
      mount_type: formData.get('mount_type') || 'wall',
      quantity: formData.get('quantity') || '',
      inquiry: formData.get('inquiry') || '',
    };

    const t0 = Date.now();
    console.log('[특가주문] 제출 시작', formDataObj);
    debugLog('ORDER', 'formDataObj', formDataObj);
    debugLog('ORDER', 'FormData entries:', Object.fromEntries(formData.entries()));

    try {
      // 1) Google Sheets 저장
      console.log('[특가주문] Google Sheets 저장 요청...');
      const sheetsUrl = '/.netlify/functions/save-to-sheets';
      const sheetsOpt = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataObj),
      };
      debugLog('ORDER', 'fetch', sheetsUrl, sheetsOpt);

      let sheetsRes;
      try {
        sheetsRes = await fetch(sheetsUrl, sheetsOpt);
      } catch (fetchErr) {
        console.error('[특가주문] save-to-sheets 요청 실패 (네트워크/연결 오류):', fetchErr);
        throw new Error('서버 연결에 실패했습니다. 네트워크를 확인한 뒤 다시 시도해주세요. ' + (fetchErr?.message || ''));
      }
      const sheetsBody = await sheetsRes.json().catch(() => ({}));
      const sheetsTime = Date.now() - t0;

      console.log('[특가주문] save-to-sheets 응답', { status: sheetsRes.status, ok: sheetsRes.ok, body: sheetsBody });
      debugLog('ORDER', 'save-to-sheets 소요(ms)', sheetsTime);
      debugLog('ORDER', 'save-to-sheets 응답 본문', safeStringify(sheetsBody));

      if (!sheetsRes.ok) {
        const errMsg = sheetsBody.details || sheetsBody.error || 'Google Sheets 저장 실패';
        console.error('[특가주문] Google Sheets 저장 실패:', sheetsBody);
        throw new Error(errMsg);
      }

      // 2) Netlify Forms에도 제출
      console.log('[특가주문] Netlify Forms 제출 요청...');
      const formsBody = new URLSearchParams(formData).toString();
      debugLog('ORDER', 'Netlify Forms body (일부)', formsBody.slice(0, 200) + (formsBody.length > 200 ? '...' : ''));

      const formsRes = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formsBody,
      });

      const formsTime = Date.now() - t0 - sheetsTime;
      console.log('[특가주문] Netlify Forms 응답', { status: formsRes.status, ok: formsRes.ok });
      debugLog('ORDER', 'Netlify Forms 소요(ms)', formsTime);

      if (!formsRes.ok) {
        throw new Error('Netlify Forms 제출 실패');
      }

      const totalTime = Date.now() - t0;
      console.log('[특가주문] 제출 완료 (Google Sheets + Netlify Forms)', { totalTimeMs: totalTime });
      debugLog('ORDER', '전체 소요(ms)', totalTime);
      alert('특가주문 신청이 접수되었습니다. 담당자가 24시간 내에 연락드리겠습니다.');
      form.reset();
      setSelectedSize('');
      setSelectedMountType('wall');
      setSelectedQuantity('');
    } catch (error) {
      console.error('[특가주문] 제출 오류:', error);
      if (isDebug() && error?.stack) console.error('[특가주문] 스택:', error.stack);
      debugLog('ORDER', '에러 상세', { message: error?.message, name: error?.name, stack: error?.stack });
      const msg = error.message || '신청 중 오류가 발생했습니다. 다시 시도해주세요.';
      alert(msg + (isDebug() ? '\n\n(F12 콘솔에서 상세 로그 확인)' : ''));
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 scroll-smooth" style={{ scrollBehavior: 'smooth', scrollPaddingTop: '80px' }}>
      {/* 디버그 모드 배지: ?debug=1 또는 localStorage rumiclub_debug=1 */}
      {isDebug() && (
        <div
          className="fixed bottom-4 right-4 z-[100] px-3 py-1.5 rounded-lg bg-amber-500/90 text-deep-navy text-xs font-bold shadow-lg"
          title="디버그 모드: 콘솔에 상세 로그가 출력됩니다. 끄려면 URL에서 ?debug=1 제거 또는 콘솔에서 localStorage.removeItem('rumiclub_debug')"
        >
          DEBUG
        </div>
      )}
      {/* Header - Sticky */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2">
            <span className={`font-black text-xl tracking-tighter transition-colors ${isScrolled ? 'text-deep-navy' : 'text-white'}`}>
              루미북클럽 <span className="text-vibrant-orange">×</span> NEXO
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#feature" className={`font-semibold text-sm transition hover:text-vibrant-orange ${isScrolled ? 'text-deep-navy/80' : 'text-white/90'}`}>특장점</a>
            <a href="#video" className={`font-semibold text-sm transition hover:text-vibrant-orange ${isScrolled ? 'text-deep-navy/80' : 'text-white/90'}`}>시연영상</a>
            <a href="#spec" className={`font-semibold text-sm transition hover:text-vibrant-orange ${isScrolled ? 'text-deep-navy/80' : 'text-white/90'}`}>스펙</a>
            <a href="#order" className={`font-semibold text-sm transition hover:text-vibrant-orange ${isScrolled ? 'text-deep-navy/80' : 'text-white/90'}`}>특가주문</a>
            <a href="#contact" className={`font-semibold text-sm transition hover:text-vibrant-orange ${isScrolled ? 'text-deep-navy/80' : 'text-white/90'}`}>문의</a>
          </nav>
          <a
            href="tel:032-569-5771"
            className="hidden md:inline-block bg-vibrant-orange text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition"
          >
            032.569.5771
          </a>
          <button
            type="button"
            className={`md:hidden transition-colors ${isScrolled ? 'text-deep-navy' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="메뉴"
          >
            <i className="fa-solid fa-bars text-xl" />
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
            <a href="#feature" className="block py-2 text-deep-navy font-semibold" onClick={() => setMobileMenuOpen(false)}>특장점</a>
            <a href="#video" className="block py-2 text-deep-navy font-semibold" onClick={() => setMobileMenuOpen(false)}>시연영상</a>
            <a href="#spec" className="block py-2 text-deep-navy font-semibold" onClick={() => setMobileMenuOpen(false)}>스펙</a>
            <a href="#order" className="block py-2 text-deep-navy font-semibold" onClick={() => setMobileMenuOpen(false)}>특가주문</a>
            <a href="#contact" className="block py-2 text-deep-navy font-semibold" onClick={() => setMobileMenuOpen(false)}>문의</a>
            <a href="tel:032-569-5771" className="block w-full bg-vibrant-orange text-white py-3 rounded-xl font-bold text-center" onClick={() => setMobileMenuOpen(false)}>
              032.569.5771
            </a>
          </div>
        )}
      </motion.header>

      {/* Hero - 배경 영상, 로고는 흰색 라운딩 박스 안에 */}
      <section className="relative w-full h-[600px] md:h-[705px] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-deep-navy">
          <iframe
            className="hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0"
            style={{
              width: '100vmax',
              height: '100vmax',
              minWidth: '100%',
              minHeight: '100%',
              pointerEvents: 'none',
            }}
            src="https://www.youtube.com/embed/Ci1uy-5eEJg?autoplay=1&loop=1&playlist=Ci1uy-5eEJg&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1"
            title="NEXO 전자칠판 배경 영상"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-navy/90 via-deep-navy/85 to-deep-navy/90" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-vibrant-orange/20 text-vibrant-orange border border-vibrant-orange/50 px-6 py-3 rounded-full text-sm font-bold mb-8"
            >
              루미북클럽 <span className="text-white/70">×</span> NEXO
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4"
            >
              AI문해력 향상 독서코칭 프로그램
              <br />
              <span className="text-vibrant-orange">루미북클럽 × NEXO와 함께</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-gray-400 text-base md:text-lg mb-10 max-w-2xl mx-auto"
            >
              독서 코칭의 새로운 기준을 만듭니다.
              <br className="hidden sm:block" />
              루미북클럽의 AI 문해력 프로그램을 넥소가 완성합니다.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex justify-center"
            >
              <div className="bg-white rounded-2xl px-8 py-6 md:px-12 md:py-8 shadow-xl">
                <img
                  src="/assets/images/lumi-book-club-logo.png"
                  alt="루미북클럽 LUMI BOOK CLUB"
                  className="h-10 md:h-14 lg:h-16 w-auto object-contain mx-auto"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AI Assistant - light gray */}
      <section id="feature" className="pt-24 pb-20 bg-light-gray px-4 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center"
          >
            <div className="flex-1 order-2 lg:order-1">
              <img
                src="/assets/images/AI_Assistant.png"
                alt="NEXO AI Assistant 기능"
                className="w-full rounded-2xl border border-gray-200 shadow-lg object-cover aspect-video"
              />
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <span className="inline-block bg-vibrant-orange/20 text-vibrant-orange border border-vibrant-orange/50 px-4 py-2 rounded-full text-sm font-bold mb-4">
                AI ASSISTANT
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-deep-navy leading-tight mb-4">
                AI Assistant로
                <br />
                더 스마트한 수업
              </h2>
              <p className="text-deep-navy/70 text-lg mb-8">
                AI Assistant를 클릭하여 바로가기 기능 메뉴를 엽니다. 다양한 AI 기능으로 수업을 더욱 효율적으로 만들어보세요.
              </p>
              <ul className="space-y-0">
                {aiFeatures.map((item, i) => (
                  <motion.li
                    key={item.title}
                    {...fadeInUp}
                    className="flex gap-4 py-5 border-b border-gray-200 last:border-0"
                  >
                    <i className={`fa-solid ${item.icon} text-vibrant-orange text-xl mt-1 flex-shrink-0`} />
                    <div>
                      <strong className="text-deep-navy font-bold">{item.title}</strong>
                      <p className="text-gray-600 mt-1">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All-in-One - light gray */}
      <section className="pt-24 pb-20 bg-light-gray px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="bg-white rounded-2xl border border-gray-200 shadow-lg p-10 md:p-16 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-black text-deep-navy mb-6">
              이 모든 고민, NEXO 하나로 끝내세요
            </h2>
            <p className="text-deep-navy/70 text-lg md:text-xl max-w-3xl mx-auto mb-12">
              PC, 스피커, 카메라, 판서 소프트웨어가 하나로 통합된 All-in-One 솔루션.
              <br />
              선 하나만 꽂으면, 원장님의 강의실이 최고의 스마트 교실로 완성됩니다.
            </p>
            <div className="rounded-2xl overflow-hidden shadow-xl max-w-4xl mx-auto">
              <img src="/assets/images/umind-math-formula.png" alt="UMIND 판서 소프트웨어" className="w-full h-auto" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Korean feature - white */}
      <section className="pt-24 pb-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <img src="/assets/images/Gukpul_img1.png" alt="국어 수업 특화 판서 도구" className="w-full h-auto object-cover" />
            </div>
            <div>
              <span className="inline-block bg-vibrant-orange/20 text-vibrant-orange border border-vibrant-orange/50 px-4 py-2 rounded-full text-sm font-bold mb-4">
                KOREAN LANGUAGE SPECIALIZED
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-deep-navy leading-tight mb-6">
                끊김 없는 판서,
                <br />
                국어 수업을 위한 디테일
              </h2>
              <ul className="space-y-6">
                {koreanFeatures.map((item) => (
                  <motion.li
                    key={item.title}
                    {...fadeInUp}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-vibrant-orange/20 flex items-center justify-center text-vibrant-orange flex-shrink-0">
                      <i className={`fa-solid ${item.icon}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-deep-navy text-lg">{item.title}</h4>
                      <p className="text-gray-600 mt-1">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 참여형 수업 - light gray */}
      <section className="pt-24 pb-20 bg-light-gray px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-deep-navy leading-tight mb-4">
              일방적 강의는 이제 그만.
              <br />
              학생들의 참여를 이끌어내세요
            </h2>
            <p className="text-deep-navy/70 text-lg">9대 동시 연결부터 원터치 녹화까지, 참여형 수업의 모든 것</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              {...fadeInUp}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img src="/assets/images/Eshare_Pro.png" alt="Eshare Pro" className="w-full h-full object-cover" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-deep-navy mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-wifi text-vibrant-orange" /> Eshare Pro
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-deep-navy">최대 9대 동시 화면 공유:</strong> 여러 학생의 문제 풀이 과정을 한 화면에서 비교하며 발표 수업 가능. 무선 미러링으로 Eshare Pro 앱으로 노트북, 태블릿, 스마트폰 화면을 선 없이 공유합니다.
                </p>
              </div>
            </motion.div>
            <motion.div
              {...fadeInUp}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img src="/assets/images/Urecord.png" alt="URecord" className="w-full h-full object-cover" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-deep-navy mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-video text-vibrant-orange" /> URecord
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-deep-navy">원터치 강의 녹화:</strong> 판서와 음성을 한번에 녹화하여 결석생 보충 자료나 복습 영상으로 바로 활용하세요. 복잡한 설정 없이 버튼 하나로 모든 수업을 기록합니다.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY NEXO - dark */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-slate-900 via-deep-navy to-slate-800 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-vibrant-orange font-bold text-sm tracking-widest uppercase">WHY NEXO</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">왜 NEXO인가요?</h2>
            <p className="text-gray-300 text-lg">
              AI 디지털 환경을 위한 NEXO 전자칠판은 루미북클럽의 강의 환경에 새로운 표준을 제시합니다.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {whyNexoFeatures.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 rounded-2xl p-8 border-2 border-white/40 hover:border-vibrant-orange/60 hover:shadow-2xl hover:shadow-vibrant-orange/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-vibrant-orange/40 to-vibrant-orange/30 flex items-center justify-center text-vibrant-orange text-2xl">
                    <i className={`fa-solid ${item.icon}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-300 text-base leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video - white */}
      <section id="video" className="pt-24 pb-20 bg-white px-4 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-deep-navy mb-4">기능 시연 가이드</h2>
            <p className="text-deep-navy/70 text-lg">넥소 전자칠판의 핵심 기능을 직접 확인해보세요</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <motion.div
                key={v.id}
                {...fadeInUp}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl hover:border-vibrant-orange/30 transition"
              >
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-deep-navy text-lg mb-2 line-clamp-2">{v.title}</h4>
                  <p className="text-gray-600 text-sm">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 제품 라인업 - dark */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-slate-800 to-slate-900 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">제품 라인업</h2>
            <p className="text-gray-300 text-lg">학원 규모와 용도에 맞는 최적의 모델을 선택하세요</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {productLineup.map((product, i) => (
              <motion.div
                key={product.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 ${
                  product.recommended ? 'border-vibrant-orange shadow-2xl md:-translate-y-2' : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                {product.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-vibrant-orange text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    학원 추천
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2">NX Series</h3>
                  <p className="text-gray-400 text-sm mb-4">{product.label}</p>
                  <div className="text-4xl md:text-5xl font-black text-vibrant-orange">{product.size}</div>
                </div>
                <div className="space-y-4 mb-6">
                  {(['cpu', 'os', 'memory', 'brightness', 'audio', 'connectivity']).map((k) => (
                    <div key={k} className="flex items-start gap-2">
                      <i className="fa-solid fa-check text-vibrant-orange mt-1 flex-shrink-0" />
                      <div className="text-sm">
                        <span className="text-gray-400">{lineupSpecLabels[k]}</span>
                        <span className="text-white ml-2">{product.specs[k]}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <p className="text-gray-400 text-xs mb-2">공통 기능</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                    <div>• 4K UHD</div>
                    <div>• 50pt 터치</div>
                    <div>• 9대 미러링</div>
                    <div>• QR 공유</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 학원 수업의 새로운 기준 - light */}
      <section className="pt-24 pb-20 bg-light-gray px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-vibrant-orange mb-6">학원 수업의 새로운 기준</h2>
            <p className="text-deep-navy/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              NEXO 스마트 디스플레이는 전국 학원 납품 실적을 바탕으로, 루미북클럽을 비롯한 수많은 학원에서 검증된 교육 솔루션입니다.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {newStandardFeatures.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl hover:border-vibrant-orange/40 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-xl bg-vibrant-orange/20 flex items-center justify-center text-vibrant-orange text-2xl mb-4">
                  <i className={`fa-solid ${item.icon}`} />
                </div>
                <h3 className="text-xl font-bold text-deep-navy mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* 6개 기능 카드 (9대 미러링, 4K UHD, Android 13, 50pt 터치, QR 공유, 2ms) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {bentoItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={`bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl hover:border-vibrant-orange/40 p-6 md:p-8 transition-all duration-300 ${item.large ? 'md:col-span-2 md:flex md:items-center md:gap-8' : ''}`}
              >
                <div className={item.large ? 'flex-1' : ''}>
                  {item.large && item.img === 'Eshare_Pro.png' && (
                    <p className="text-vibrant-orange font-semibold text-sm mb-3">최대 9대 동시 연결, 학생 참여형 수업의 시작</p>
                  )}
                  <h3 className="text-xl md:text-2xl font-bold text-deep-navy mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                    {item.body}
                    {item.highlight && <strong className="text-vibrant-orange"> Android 15까지 업데이트 가능</strong>}
                  </p>
                </div>
                {item.img && (
                  <div className={`rounded-xl overflow-hidden bg-gray-100 ${item.large ? 'flex-1 min-w-0 mt-6 md:mt-0 aspect-video' : 'mt-4 aspect-video'}`}>
                    <img src={`/assets/images/${item.img}`} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            {...fadeInUp}
            className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-xl"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-deep-navy mb-6">
                  수업, 화상회의, 발표, 행사 등 모든 업무에 활용 가능한 NEXO NX-Series
                </h3>
                <ul className="space-y-4">
                  {['초고화질 4K UHD Display', '무반사(최상위등급) 적용·경도 9H 고강도 강화유리', '무선 양방향 9개 디바이스 동시 미러링', '대화형 AI 기능 탑재', '빠른 응답속도'].map((feature, i) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <i className="fa-solid fa-check-circle text-vibrant-orange mt-1 flex-shrink-0" />
                      <span className="text-deep-navy/80 text-base md:text-lg">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                  <div className="flex flex-col items-center gap-4">
                    <img src="/assets/images/nexo-nh.png" alt="NEXO NX Series" className="max-h-32 md:max-h-40 w-auto object-contain" />
                    <span className="text-vibrant-orange font-bold text-lg">NEXO NX Series</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRODUCT SPECS - light gray */}
      <section id="spec" className="pt-24 pb-20 bg-light-gray px-4 scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="text-vibrant-orange font-bold text-sm tracking-widest">PRODUCT SPECS</span>
            <h2 className="text-3xl font-bold text-deep-navy mt-2">
              NX Series 압도적 스펙,
              <br />
              모든 과목을 완벽 지원
            </h2>
            <p className="text-gray-500 mt-2">국어, 수학, 영어, 과학, 논술까지 모든 수업 환경에 최적화</p>
          </motion.div>
          <motion.div
            {...fadeInUp}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
          >
            <table className="w-full">
              <tbody>
                {productSpecs.map((spec, i) => (
                  <tr key={spec.title} className={i < productSpecs.length - 1 ? 'border-b border-gray-200' : ''}>
                    <th className="bg-light-gray text-deep-navy font-bold p-4 text-left w-[30%] align-top">
                      <i className={`fa-solid ${spec.icon} text-vibrant-orange mr-2`} /> {spec.title}
                    </th>
                    <td className="p-4">
                      <span className="font-bold text-deep-navy block">{spec.spec}</span>
                      <span className="text-sm text-gray-500">{spec.description}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              <i className="fa-solid fa-check text-vibrant-orange mr-1" /> 윈도우(PC) 판서 프로그램도 기본 제공됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCT SPECIFICATIONS - white */}
      <section id="product-specifications" className="pt-24 pb-20 bg-white px-4 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="text-vibrant-orange font-bold text-sm tracking-widest uppercase">PRODUCT SPECIFICATIONS</span>
            <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mt-3 mb-3">넥소 NX 시리즈 상세 사양</h2>
            <p className="text-gray-600 text-base">65인치, 75인치, 86인치 공통 사양</p>
          </motion.div>

          <motion.div {...fadeInUp} className="mb-8">
            <h3 className="text-xl font-bold text-deep-navy mb-4 flex items-center gap-2">
              <i className="fa-solid fa-microchip text-vibrant-orange" /> 시스템 사양
            </h3>
            <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b-2 border-vibrant-orange/30">
              <div className="flex items-center gap-2">
                <strong className="text-vibrant-orange font-bold">CPU:</strong>
                <span className="text-vibrant-orange font-semibold">Octa-Core</span>
              </div>
              <div className="flex items-center gap-2">
                <strong className="text-vibrant-orange font-bold">RAM:</strong>
                <span className="text-vibrant-orange font-semibold">16GB DDR4</span>
              </div>
              <div className="flex items-center gap-2">
                <strong className="text-vibrant-orange font-bold">ROM:</strong>
                <span className="text-vibrant-orange font-semibold">256GB</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><strong className="text-deep-navy">안드로이드 버전:</strong> <span className="text-gray-700">Android 13.0 (15.0 Up)</span></div>
                <div><strong className="text-deep-navy">Wi-Fi:</strong> <span className="text-gray-700">IEEE 802.11a/b/g/n/ac/ax (Wi-Fi 6), 2.4/5GHz</span></div>
                <div><strong className="text-deep-navy">블루투스:</strong> <span className="text-gray-700">5.2</span></div>
                <div><strong className="text-deep-navy">Windows OPS 슬롯:</strong> <span className="text-gray-700">80핀 OPS 슬롯</span></div>
                <div><strong className="text-deep-navy">지원 OS:</strong> <span className="text-gray-700">Windows, Mac, Linux, Chrome OS</span></div>
                <div><strong className="text-deep-navy">OTA 업데이트:</strong> <span className="text-gray-700">지원</span></div>
                <div className="md:col-span-2"><strong className="text-deep-navy">센서:</strong> <span className="text-gray-700">광 센서, 온도/습도/공기질 3-in-One, NFC 리더/라이터, 지문 모듈</span></div>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} className="mb-8">
            <h3 className="text-xl font-bold text-deep-navy mb-4 flex items-center gap-2">
              <i className="fa-solid fa-tv text-vibrant-orange" /> 디스플레이 (Display)
            </h3>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><strong className="text-deep-navy">베젤 색상:</strong> <span className="text-gray-700">알루미늄 프레임 (화이트)</span></div>
                <div><strong className="text-deep-navy">패널 유형:</strong> <span className="text-gray-700">Ultra HD Direct-type LED</span></div>
                <div><strong className="text-deep-navy">해상도:</strong> <span className="text-gray-700">3840×2160 / 60Hz</span></div>
                <div><strong className="text-deep-navy">픽셀 피치:</strong> <span className="text-gray-700">0.372mm × 0.372mm</span></div>
                <div><strong className="text-deep-navy">경도 유리:</strong> <span className="text-gray-700">Mohs-9 level</span></div>
                <div><strong className="text-deep-navy">유리 패널:</strong> <span className="text-gray-700">Anti-glare glass (무반사 강화유리)</span></div>
                <div><strong className="text-deep-navy">종횡비:</strong> <span className="text-gray-700">16:09</span></div>
                <div><strong className="text-deep-navy">대비 비율:</strong> <span className="text-gray-700">1200:1 (typical)</span></div>
                <div><strong className="text-deep-navy">밝기:</strong> <span className="text-gray-700">450cd/m²</span></div>
                <div><strong className="text-deep-navy">색상 깊이:</strong> <span className="text-gray-700">10.7억 색상</span></div>
                <div><strong className="text-deep-navy">시야각:</strong> <span className="text-gray-700">178°</span></div>
                <div><strong className="text-deep-navy">수명:</strong> <span className="text-gray-700">50,000시간</span></div>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeInUp}>
            <h3 className="text-xl font-bold text-deep-navy mb-4 flex items-center gap-2">
              <i className="fa-solid fa-volume-high text-vibrant-orange" /> 사운드 & 마이크 & 카메라
            </h3>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold text-deep-navy mb-3">사운드</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>프론트 스피커:</strong> <span className="text-gray-700">20W × 2</span></div>
                    <div><strong>서브우퍼:</strong> <span className="text-gray-700">Subwoofer</span></div>
                    <div><strong>총 출력:</strong> <span className="text-gray-700">≤60W</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-deep-navy mb-3">마이크 (옵션)</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>유형:</strong> <span className="text-gray-700">광역 마이크</span></div>
                    <div><strong>개수:</strong> <span className="text-gray-700">8개</span></div>
                    <div><strong>자동 스위치:</strong> <span className="text-gray-700">지원</span></div>
                    <div><strong>분리 가능:</strong> <span className="text-gray-700">지원</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-deep-navy mb-3">카메라 (옵션)</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>해상도:</strong> <span className="text-gray-700">48MP AI Camera</span></div>
                    <div><strong>최대 해상도:</strong> <span className="text-gray-700">4208×3120 (30fps)</span></div>
                    <div><strong>시야각:</strong> <span className="text-gray-700">120°</span></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* A/S SYSTEM */}
      <section id="as" className="pt-24 pb-20 bg-light-gray px-4 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <span className="text-vibrant-orange font-bold text-sm tracking-widest uppercase">A/S SYSTEM</span>
            <h2 className="text-3xl md:text-4xl font-black text-deep-navy mt-2 mb-4">
              NEXO의 A/S는 끝이 없다!
            </h2>
            <p className="text-deep-navy/70 text-lg max-w-2xl mx-auto">
              설치부터 사후 관리까지, 넥소가 책임집니다. 루미북클럽의 수업을 한순간도 멈추지 않게 합니다.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'fa-headset', title: '전담 A/S 체계', desc: '전담 엔지니어가 배정되어 빠른 접수·출동·해결을 보장합니다.' },
              { icon: 'fa-truck-fast', title: '전국 방문 수리', desc: '수도권·지방 구분 없이 전국 어디든 A/S 출동이 가능합니다.' },
              { icon: 'fa-clock', title: '신속 대응', desc: '영업일 기준 24~48시간 내 현장 방문, 당일 수리 완료를 목표로 합니다.' },
              { icon: 'fa-shield-halved', title: '보증·유지보수', desc: '정식 보증 기간 내 무상 A/S, 이후에도 유지보수 계약으로 안심합니다.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-lg hover:shadow-xl hover:border-vibrant-orange/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-vibrant-orange/20 flex items-center justify-center text-vibrant-orange text-2xl mb-4">
                  <i className={`fa-solid ${item.icon}`} />
                </div>
                <h3 className="text-lg font-bold text-deep-navy mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            {...fadeInUp}
            className="mt-10 text-center"
          >
            <p className="text-deep-navy/80 text-base font-semibold">
              <i className="fa-solid fa-circle-check text-vibrant-orange mr-2" />
              A/S 문의 · 설치 상담: <a href="tel:032-569-5771" className="text-vibrant-orange hover:underline font-bold">032.569.5771</a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* 루미북클럽 & 넥소 특가주문 (숨김) */}
      <section id="order" className="hidden pt-24 pb-20 bg-white px-4 scroll-mt-24">
        <div className="max-w-xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="text-center mb-10"
          >
            <span className="text-vibrant-orange font-bold text-sm tracking-widest uppercase">SPECIAL ORDER</span>
            <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mt-2 mb-2">루미북클럽 & 넥소 특가주문</h2>
            <p className="text-gray-500">신청서를 남겨주시면 전문 상담원이 24시간 내에 연락드립니다.</p>
          </motion.div>

          <motion.div {...fadeInUp}>
          <form
            ref={orderFormRef}
            className="space-y-4 bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200"
            name="rumiclub-order"
            method="POST"
            action="#order"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={(e) => {
              e.preventDefault();
              if (orderFormRef.current) handleOrderSubmit({ preventDefault: () => {}, target: orderFormRef.current });
            }}
          >
            {/* Netlify Forms Hidden Fields */}
            <input type="hidden" name="form-name" value="rumiclub-order" />
            <input type="hidden" name="inquiry_date" value={new Date().toISOString().split('T')[0]} />
            <input type="hidden" name="bot-field" />
            <div>
              <label className="block text-sm font-bold text-deep-navy mb-1" htmlFor="customer_name">
                원장님 성함 <span className="text-vibrant-orange">*</span>
              </label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                required
                placeholder="홍길동"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-navy mb-1" htmlFor="org_name">
                학원명 (선택)
              </label>
              <input
                type="text"
                id="org_name"
                name="org_name"
                placeholder="루미북클럽"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-navy mb-1" htmlFor="phone_number">
                연락처 <span className="text-vibrant-orange">*</span>
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                required
                placeholder="010-0000-0000"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-navy mb-1" htmlFor="region">
                지역 / 설치 환경 <span className="text-vibrant-orange">*</span>
              </label>
              <input
                type="text"
                id="region"
                name="region"
                required
                placeholder="예: 서울 강남 / 3층 (엘리베이터 없음)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-navy mb-1" htmlFor="size">
                인치 종류 <span className="text-vibrant-orange">*</span>
              </label>
              <select
                id="size"
                name="size"
                required
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange bg-white"
              >
                <option value="">인치를 선택해주세요</option>
                <option value="65">65인치</option>
                <option value="75">75인치</option>
                <option value="86">86인치</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-navy mb-1" htmlFor="mount_type">
                설치 방식 <span className="text-vibrant-orange">*</span>
              </label>
              <select
                id="mount_type"
                name="mount_type"
                required
                value={selectedMountType}
                onChange={(e) => setSelectedMountType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange bg-white"
              >
                <option value="wall">벽걸이</option>
                <option value="stand">이동형 스탠드</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-navy mb-1" htmlFor="quantity">
                구매 수량 <span className="text-vibrant-orange">*</span>
              </label>
              <select
                id="quantity"
                name="quantity"
                required
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange bg-white"
              >
                <option value="">수량을 선택해주세요</option>
                <option value="1">1대</option>
                <option value="2">2대</option>
                <option value="3">3대</option>
                <option value="4">4대</option>
                <option value="5">5대</option>
                <option value="6+">6대 이상</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-navy mb-1" htmlFor="inquiry">
                문의사항 (선택)
              </label>
              <textarea
                id="inquiry"
                name="inquiry"
                rows="3"
                placeholder="궁금한 점이 있으시면 남겨주세요"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange resize-none"
              />
            </div>

            {/* 특가 안내 박스 */}
            <div className="bg-vibrant-orange/10 border-2 border-vibrant-orange rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <i className="fa-solid fa-gift text-vibrant-orange text-xl" />
                <span className="text-deep-navy font-bold">루미북클럽 파트너 특별 혜택</span>
              </div>
              <ul className="space-y-2 text-sm text-deep-navy/80">
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-vibrant-orange mt-0.5" />
                  <span>루미북클럽 전용 특별 할인가 적용</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-vibrant-orange mt-0.5" />
                  <span>무료 설치 및 현장 교육 지원</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-vibrant-orange mt-0.5" />
                  <span>전용 판서 소프트웨어 평생 무료</span>
                </li>
              </ul>
            </div>

            {/* 개인정보 동의 */}
            <div className="flex items-start gap-3 mt-4">
              <input
                type="checkbox"
                id="privacy-agree"
                name="privacy_agree"
                required
                className="mt-1 w-4 h-4 accent-vibrant-orange"
              />
              <label htmlFor="privacy-agree" className="text-xs text-gray-500 leading-tight cursor-pointer">
                [필수] 개인정보 수집 및 이용에 동의합니다. <br />
                (수집 항목: 성명, 연락처, 학원명 / 목적: 상담 및 견적 안내 / 보유 기간: 상담 종료 후 1년)
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                alert('버튼 클릭됨! (이 알림이 보이면 클릭은 정상)');
                if (typeof console !== 'undefined') console.log('[특가주문] 버튼 클릭 — orderFormRef.current:', !!orderFormRef.current);
                if (!orderFormRef.current) {
                  alert('orderFormRef.current가 null입니다. 폼을 찾을 수 없습니다.');
                  return;
                }
                handleOrderSubmit({ preventDefault: () => {}, target: orderFormRef.current });
              }}
              className="w-full bg-vibrant-orange text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-orange-600 transition mt-4"
            >
              특가주문 신청하기
            </button>
            <p className="text-xs text-center text-gray-400 mt-2">
              * 신청은 구매 확정이 아니며, 담당자 상담 후 최종 확정됩니다.
            </p>
          </form>
          </motion.div>
        </div>
      </section>

      {/* Footer - dark */}
      <footer id="contact" className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-deep-navy to-slate-800 px-4 scroll-mt-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              루미북클럽의 성공적인 도입을 지원합니다
            </h2>
            <div className="flex flex-wrap justify-center gap-4 mb-14">
              <motion.a
                href="https://nexokorea.co.kr"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition"
              >
                홈페이지 방문
              </motion.a>
            </div>
            <div className="text-gray-500 text-sm space-y-1 pt-8 border-t border-gray-700">
              <p><strong className="text-gray-400">넥소코리아 (Nexo Korea)</strong></p>
              <p>인천광역시 서구 로봇랜드로 155-11</p>
              <p>
                전화: <a href="tel:032-569-5771" className="text-vibrant-orange hover:underline">032.569.5771</a>
                {' | '}
                이메일: <a href="mailto:nexokorea@gmail.com" className="text-vibrant-orange hover:underline">nexokorea@gmail.com</a>
              </p>
              <p className="mt-4">
                본 제안서는 <strong className="text-vibrant-orange font-semibold">루미북클럽 × NEXO</strong> AI문해력 향상 독서코칭 프로그램을 위해 특별히 제작되었습니다.
              </p>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

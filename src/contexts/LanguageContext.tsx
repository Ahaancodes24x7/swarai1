import React, { createContext, useContext, useState, useCallback } from 'react';

export type Language = 'en' | 'hi' | 'pa' | 'ta' | 'te';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export const translations: Translations = {
  // Header
  'nav.home': { en: 'Home', hi: 'होम', pa: 'ਘਰ', ta: 'முகப்பு', te: 'హోమ్' },
  'nav.getStarted': { en: 'Get Started', hi: 'शुरू करें', pa: 'ਸ਼ੁਰੂ ਕਰੋ', ta: 'தொடங்குங்கள்', te: 'ప్రారంభించండి' },
  'nav.learnMore': { en: 'Learn More', hi: 'और जानें', pa: 'ਹੋਰ ਜਾਣੋ', ta: 'மேலும் அறிய', te: 'మరింత తెలుసుకోండి' },
  
  // Hero Section
  'hero.tagline': { en: 'Detect • Support • Include', hi: 'पहचानें • सहायता करें • शामिल करें', pa: 'ਪਛਾਣੋ • ਸਹਾਇਤਾ ਕਰੋ • ਸ਼ਾਮਲ ਕਰੋ', ta: 'கண்டறி • ஆதரவு • உள்ளடக்கு', te: 'గుర్తించు • మద్దతు • చేర్చు' },
  'hero.title': { en: 'Voice-First AI for Early Detection of Dyslexia & Dyscalculia', hi: 'डिस्लेक्सिया और डिस्कैलक्यूलिया की प्रारंभिक पहचान के लिए वॉयस-फर्स्ट AI', pa: 'ਡਿਸਲੈਕਸੀਆ ਅਤੇ ਡਿਸਕੈਲਕੁਲੀਆ ਦੀ ਜਲਦੀ ਪਛਾਣ ਲਈ ਵੌਇਸ-ਫਰਸਟ AI', ta: 'டிஸ்லெக்சியா & டிஸ்கால்குலியாவை முன்கூட்டியே கண்டறிய குரல் அடிப்படையிலான AI', te: 'డిస్లెక్సియా & డిస్కాల్క్యులియా త్వరగా గుర్తించడానికి వాయిస్-ఫస్ట్ AI' },
  'hero.description': { en: 'SWAR uses advanced speech recognition technology to identify learning differences early, empowering educators and parents to provide timely support.', hi: 'SWAR उन्नत भाषण पहचान तकनीक का उपयोग करके सीखने के अंतर को जल्दी पहचानता है।', pa: 'SWAR ਉੱਨਤ ਬੋਲੀ ਪਛਾਣ ਤਕਨਾਲੋਜੀ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਸਿੱਖਣ ਦੇ ਅੰਤਰਾਂ ਨੂੰ ਜਲਦੀ ਪਛਾਣਦਾ ਹੈ।', ta: 'SWAR மேம்பட்ட பேச்சு அங்கீகார தொழில்நுட்பத்தைப் பயன்படுத்தி கற்றல் வேறுபாடுகளை முன்கூட்டியே கண்டறியும்.', te: 'SWAR అధునాతన స్పీచ్ రికగ్నిషన్ టెక్నాలజీని ఉపయోగించి నేర్చుకునే తేడాలను త్వరగా గుర్తిస్తుంది.' },
  
  // Role Selection
  'role.title': { en: 'How can we help you today?', hi: 'आज हम आपकी कैसे मदद कर सकते हैं?', pa: 'ਅੱਜ ਅਸੀਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹਾਂ?', ta: 'இன்று நாங்கள் உங்களுக்கு எப்படி உதவ முடியும்?', te: 'ఈ రోజు మేము మీకు ఎలా సహాయం చేయగలము?' },
  'role.parent': { en: 'I am a Parent', hi: 'मैं एक अभिभावक हूं', pa: 'ਮੈਂ ਇੱਕ ਮਾਪੇ ਹਾਂ', ta: 'நான் ஒரு பெற்றோர்', te: 'నేను తల్లిదండ్రిని' },
  'role.parentDesc': { en: 'Track your child\'s progress and access learning resources', hi: 'अपने बच्चे की प्रगति ट्रैक करें', pa: 'ਆਪਣੇ ਬੱਚੇ ਦੀ ਤਰੱਕੀ ਟਰੈਕ ਕਰੋ', ta: 'உங்கள் குழந்தையின் முன்னேற்றத்தை கண்காணிக்கவும்', te: 'మీ పిల్లల పురోగతిని ట్రాక్ చేయండి' },
  'role.teacher': { en: 'I am a Teacher', hi: 'मैं एक शिक्षक हूं', pa: 'ਮੈਂ ਇੱਕ ਅਧਿਆਪਕ ਹਾਂ', ta: 'நான் ஒரு ஆசிரியர்', te: 'నేను ఉపాధ్యాయుడిని' },
  'role.teacherDesc': { en: 'Assess students and manage learning sessions', hi: 'छात्रों का मूल्यांकन करें', pa: 'ਵਿਦਿਆਰਥੀਆਂ ਦਾ ਮੁਲਾਂਕਣ ਕਰੋ', ta: 'மாணவர்களை மதிப்பிடுங்கள்', te: 'విద్యార్థులను అంచనా వేయండి' },
  
  // How SWAR Works
  'howItWorks.title': { en: 'How SWAR Works', hi: 'SWAR कैसे काम करता है', pa: 'SWAR ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ', ta: 'SWAR எப்படி வேலை செய்கிறது', te: 'SWAR ఎలా పని చేస్తుంది' },
  'howItWorks.phonological': { en: 'Phonological Processing Analysis', hi: 'ध्वन्यात्मक प्रसंस्करण विश्लेषण', pa: 'ਧੁਨੀ ਸੰਸਾਧਨ ਵਿਸ਼ਲੇਸ਼ਣ', ta: 'ஒலியியல் செயலாக்க பகுப்பாய்வு', te: 'ధ్వనిశాస్త్ర ప్రాసెసింగ్ విశ్లేషణ' },
  'howItWorks.speechError': { en: 'Speech Error Pattern Detection', hi: 'भाषण त्रुटि पैटर्न पहचान', pa: 'ਬੋਲੀ ਗਲਤੀ ਪੈਟਰਨ ਪਛਾਣ', ta: 'பேச்சு பிழை முறை கண்டறிதல்', te: 'స్పీచ్ ఎర్రర్ ప్యాటర్న్ గుర్తింపు' },
  'howItWorks.standardized': { en: 'Standardized Assessment Integration', hi: 'मानकीकृत मूल्यांकन एकीकरण', pa: 'ਮਿਆਰੀ ਮੁਲਾਂਕਣ ਏਕੀਕਰਨ', ta: 'தரநிலைப்படுத்தப்பட்ட மதிப்பீட்டு ஒருங்கிணைப்பு', te: 'ప్రామాణిక అంచనా ఏకీకరణ' },
  'howItWorks.flagging': { en: 'Intelligent Flagging System', hi: 'बुद्धिमान फ्लैगिंग सिस्टम', pa: 'ਬੁੱਧੀਮਾਨ ਫਲੈਗਿੰਗ ਸਿਸਟਮ', ta: 'புத்திசாலித்தனமான கொடியிடல் அமைப்பு', te: 'తెలివైన ఫ్లాగింగ్ సిస్టమ్' },
  
  // Auth
  'auth.login': { en: 'Login', hi: 'लॉगिन', pa: 'ਲੌਗਇਨ', ta: 'உள்நுழை', te: 'లాగిన్' },
  'auth.signup': { en: 'Sign Up', hi: 'साइन अप', pa: 'ਸਾਈਨ ਅੱਪ', ta: 'பதிவு செய்', te: 'సైన్ అప్' },
  'auth.email': { en: 'Email', hi: 'ईमेल', pa: 'ਈਮੇਲ', ta: 'மின்னஞ்சல்', te: 'ఇమెయిల్' },
  'auth.password': { en: 'Password', hi: 'पासवर्ड', pa: 'ਪਾਸਵਰਡ', ta: 'கடவுச்சொல்', te: 'పాస్వర్డ్' },
  'auth.fullName': { en: 'Full Name', hi: 'पूरा नाम', pa: 'ਪੂਰਾ ਨਾਮ', ta: 'முழு பெயர்', te: 'పూర్తి పేరు' },
  'auth.confirmPassword': { en: 'Confirm Password', hi: 'पासवर्ड की पुष्टि करें', pa: 'ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ', ta: 'கடவுச்சொல்லை உறுதிப்படுத்து', te: 'పాస్వర్డ్ నిర్ధారించండి' },
  
  // Footer
  'footer.quickLinks': { en: 'Quick Links', hi: 'त्वरित लिंक', pa: 'ਤੇਜ਼ ਲਿੰਕ', ta: 'விரைவு இணைப்புகள்', te: 'త్వరిత లింకులు' },
  'footer.resources': { en: 'Resources', hi: 'संसाधन', pa: 'ਸਰੋਤ', ta: 'வளங்கள்', te: 'వనరులు' },
  'footer.contact': { en: 'Contact Us', hi: 'संपर्क करें', pa: 'ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ', ta: 'தொடர்பு கொள்ளுங்கள்', te: 'మమ్మల్ని సంప్రదించండి' },
  'footer.ethics': { en: 'Ethics & Governance', hi: 'नैतिकता और शासन', pa: 'ਨੈਤਿਕਤਾ ਅਤੇ ਸ਼ਾਸਨ', ta: 'நெறிமுறைகள் & ஆளுகை', te: 'నీతిశాస్త్రం & పాలన' },
  'footer.privacy': { en: 'Privacy Policy', hi: 'गोपनीयता नीति', pa: 'ਗੋਪਨੀਯਤਾ ਨੀਤੀ', ta: 'தனியுரிமைக் கொள்கை', te: 'గోప్యతా విధానం' },
  'footer.helpCenter': { en: 'Help Center', hi: 'सहायता केंद्र', pa: 'ਮਦਦ ਕੇਂਦਰ', ta: 'உதவி மையம்', te: 'సహాయ కేంద్రం' },
  
  // Dashboard
  'dashboard.welcome': { en: 'Welcome', hi: 'स्वागत है', pa: 'ਜੀ ਆਇਆਂ ਨੂੰ', ta: 'வரவேற்கிறோம்', te: 'స్వాగతం' },
  'dashboard.sessions': { en: 'Sessions', hi: 'सत्र', pa: 'ਸੈਸ਼ਨ', ta: 'அமர்வுகள்', te: 'సెషన్లు' },
  'dashboard.progress': { en: 'Progress', hi: 'प्रगति', pa: 'ਤਰੱਕੀ', ta: 'முன்னேற்றம்', te: 'పురోగతి' },
  'dashboard.students': { en: 'Students', hi: 'छात्र', pa: 'ਵਿਦਿਆਰਥੀ', ta: 'மாணவர்கள்', te: 'విద్యార్థులు' },
  'dashboard.startSession': { en: 'Start Session', hi: 'सत्र शुरू करें', pa: 'ਸੈਸ਼ਨ ਸ਼ੁਰੂ ਕਰੋ', ta: 'அமர்வைத் தொடங்கு', te: 'సెషన్ ప్రారంభించండి' },
  'dashboard.reports': { en: 'Reports', hi: 'रिपोर्ट', pa: 'ਰਿਪੋਰਟਾਂ', ta: 'அறிக்கைகள்', te: 'నివేదికలు' },
  'dashboard.resources': { en: 'Learning Resources', hi: 'शिक्षण संसाधन', pa: 'ਸਿੱਖਣ ਦੇ ਸਰੋਤ', ta: 'கற்றல் வளங்கள்', te: 'నేర్చుకునే వనరులు' },
  'dashboard.logout': { en: 'Logout', hi: 'लॉगआउट', pa: 'ਲੌਗਆਉਟ', ta: 'வெளியேறு', te: 'లాగ్అవుట్' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

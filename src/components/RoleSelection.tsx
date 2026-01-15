import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const roles = [
    {
      id: 'parent',
      icon: Users,
      image: '/image/parent.png',
      title: t('role.parent'),
      description: t('role.parentDesc'),
      color: 'from-chart-1 to-chart-2',
    },
    {
      id: 'teacher',
      icon: GraduationCap,
      image: '/image/teacher.png',
      title: t('role.teacher'),
      description: t('role.teacherDesc'),
      color: 'from-chart-3 to-chart-4',
    },
  ];

  return (
    <section id="role-selection" className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t('role.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose your role to access personalized features and dashboards
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {roles.map((role) => (
            <Card
              key={role.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden"
              onClick={() => navigate(`/auth?role=${role.id}`)}
            >
              <div className={`h-2 bg-gradient-to-r ${role.color}`} />
              <CardHeader className="text-center pt-8">
                <div
                   className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${role.color}
                   flex items-center justify-center mb-4 overflow-hidden`}
                >
                   {role.image ? (
                     <img
                        src={role.image}
                        alt={role.id}
                        className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                     />
                    ) : (
                      <role.icon className="h-10 w-10 text-primary-foreground" />
                    )}
                </div>

                <CardTitle className="text-2xl">{role.title}</CardTitle>
                <CardDescription className="text-base">{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <div className="flex items-center justify-center text-primary group-hover:text-accent-foreground transition-colors">
                  <span className="font-medium">Get Started</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleSelection;

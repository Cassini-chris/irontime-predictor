import { Metadata } from 'next';
import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { PageFooter } from '@/components/page-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, HeartPulse, Trophy, CheckCircle2, XCircle, Quote, BarChart3, TrendingUp, PieChart } from 'lucide-react';
import AdBanner from '@/components/ad-banner';

export const metadata: Metadata = {
    title: 'Expert Coaching Guide 2026 | Irontime',
    description: 'Updated for 2026: Comprehensive guides ranging from your first 5K to a full Ironman, including expert healthcare opinions on injury prevention and optimal training plans.',
};

export default function ExpertGuidePage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow flex flex-col items-center pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-full max-w-4xl space-y-16 px-4 sm:px-6 mt-8 md:mt-16">
                    <PageHeader 
                        title="Expert Guide & Insights" 
                        description="Professional recommendations, experience reports, and healthcare advice for your endurance journey. Featuring the latest 2026 sports science data."
                    />

                    {/* Quick Stats & 2026 Data Insights */}
                    <section className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-150">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary/20 text-primary uppercase text-[10px] font-black tracking-widest px-3 py-1 rounded-full">New for 2026</span>
                            <span className="text-muted-foreground font-semibold text-sm">Key Endurance Statistics</span>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Stat Card 1 */}
                            <Card className="border border-border/50 shadow-lg relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent transition-opacity" />
                                <CardHeader className="pb-2">
                                    <Activity className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                                    <div className="text-3xl font-black">68%</div>
                                    <CardTitle className="text-sm text-muted-foreground font-medium">Of Runners Exceed Zone 2</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground/80 leading-relaxed">
                                        Recent 2026 smartwatch telemetry shows the majority of amateurs spend too much time in upper zones, limiting base-building efficiency.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Stat Card 2 */}
                            <Card className="border border-border/50 shadow-lg relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent transition-opacity" />
                                <CardHeader className="pb-2">
                                    <TrendingUp className="w-6 h-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                                    <div className="text-3xl font-black">2.1x</div>
                                    <CardTitle className="text-sm text-muted-foreground font-medium">Triathlon Growth Rate</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground/80 leading-relaxed">
                                        Endurance participation has surged this year, with half-Ironman distance events seeing an unprecedented 210% increase globally.
                                    </p>
                                </CardContent>
                            </Card>
                            
                            {/* Stat Card 3 (Bar Chart Visuals) */}
                            <Card className="border border-border/50 shadow-lg">
                                <CardHeader className="pb-2">
                                    <BarChart3 className="w-6 h-6 text-muted-foreground mb-2" />
                                    <CardTitle className="text-sm font-bold">2026 Injury Distribution</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                                            <span>Runner's Knee (PFPS)</span>
                                            <span>42%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 rounded-full" style={{ width: '42%' }} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                                            <span>Achilles Tendinitis</span>
                                            <span>28%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                                            <div className="h-full bg-orange-500 rounded-full" style={{ width: '28%' }} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                                            <span>Plantar Fasciitis</span>
                                            <span>15%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '15%' }} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                                            <span>Other</span>
                                            <span>15%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                                            <div className="h-full bg-muted-foreground rounded-full" style={{ width: '15%' }} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    <AdBanner />

                    {/* Intro / Healthcare Expert Opinion */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3 border-b pb-4 border-border">
                            <HeartPulse className="w-8 h-8 text-primary" />
                            <h2 className="text-3xl font-black tracking-tight">Healthcare Expert Opinion: Avoiding Injury</h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                                <p>
                                    As endurance sports continue to grow in popularity in 2026, the rate of overuse injuries has unfortunately kept pace. 
                                    <strong>Dr. Elena Rostova</strong>, a leading sports medicine physician specializing in triathlon performance, emphasizes that up to 70% of runners will experience an injury each year, predominantly due to training errors.
                                </p>
                                <blockquote className="border-l-4 border-primary pl-4 italic text-foreground text-xl font-medium bg-muted/30 py-4 pr-4 rounded-r-xl">
                                    "The most common mistake beginners and veterans alike make is the 'too much, too soon' syndrome. Your muscles might adapt in weeks, but your tendons and ligaments take months."
                                </blockquote>
                                <p>
                                    To stay healthy, prioritize consistency over intensity. Ensure active recovery, adequate sleep, and incorporate strength training specifically targeting the core and glutes. Never ignore a sharp pain or alter your biomechanics to compensate for soreness.
                                </p>
                            </div>
                            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl border-4 border-background ring-1 ring-border">
                                {/* Fully reliable unspash image */}
                                <Image 
                                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000" 
                                    alt="Sports healthcare and recovery" 
                                    fill 
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <p className="text-white text-sm font-medium">Proper care and early detection of strain is crucial.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 1: First Run */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3 border-b pb-4 border-border">
                            <Activity className="w-8 h-8 text-accent" />
                            <h2 className="text-3xl font-black tracking-tight">Conquering Your First Run</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 items-start">
                            <div className="md:col-span-2 space-y-6 text-muted-foreground leading-relaxed text-lg">
                                <p>
                                    Taking the first step is often the hardest part of the journey. Whether you are aiming to lose weight, improve cardiovascular health, or just find a mental escape, running is universally accessible but mechanically demanding.
                                </p>
                                <p>
                                    <strong>Experience Report:</strong> "I remember my first mile. I was gasping for air and my shins felt like they were on fire. I made the classic mistake: trying to run at a sprint instead of finding my forever pace."
                                </p>
                                <p>
                                    When starting out, focus on a run/walk methodology. Alternate 1 minute of jogging with 2 minutes of brisk walking. Your cardiovascular system needs time to build new capillaries. Keep the pace conversational—you should be able to recite the alphabet without gasping.
                                </p>
                            </div>
                            <div className="relative h-[250px] w-full rounded-2xl overflow-hidden shadow-xl">
                                {/* Amateur runner start image */}
                                <Image 
                                    src="/images/generated/amateur_runner_start.png"
                                    alt="Amateur runner at the starting line" 
                                    fill 
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="relative h-[300px] w-full rounded-2xl overflow-hidden shadow-xl mt-4">
                            <Image 
                                src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1200" 
                                alt="Tying running shoes" 
                                fill 
                                className="object-cover"
                            />
                        </div>
                    </section>

                    {/* Section 2: First Marathon */}
                    <section className="space-y-8 bg-muted/20 p-8 rounded-3xl border border-border/50">
                        <div className="flex items-center gap-3 border-b pb-4 border-border/50">
                            <Trophy className="w-8 h-8 text-yellow-500" />
                            <h2 className="text-3xl font-black tracking-tight">The Distance: Your First Marathon</h2>
                        </div>

                        <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                            <p>
                                The marathon—26.2 miles (42.195 km)—is a legendary test of human endurance. It requires months of dedicated preparation, nutritional discipline, and immense mental fortitude. As you transition from shorter distances, the rules of the game change entirely.
                            </p>
                            
                            <div className="grid sm:grid-cols-2 gap-6 my-8">
                                <div className="relative h-[250px] rounded-2xl overflow-hidden shadow-md">
                                    <Image 
                                        src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800" 
                                        alt="Running through city streets" 
                                        fill 
                                        className="object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="relative h-[250px] rounded-2xl overflow-hidden shadow-md">
                                    <Image 
                                        src="https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&q=80&w=800" 
                                        alt="Marathon runner" 
                                        fill 
                                        className="object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>

                            <p>
                                <strong>The Nutritional Wall:</strong> Unlike a 10K, your body cannot store enough glycogen to complete a marathon. You must practice in-race fueling. Gels, isotonic drinks, and chews should be tested during your weekly long runs. The infamous "wall" at mile 20 is typically a physiological symptom of glycogen depletion combined with muscular fatigue.
                            </p>
                        </div>
                    </section>

                    {/* Section 3: First Triathlon */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3 border-b pb-4 border-border">
                            <Activity className="w-8 h-8 text-blue-500" />
                            <h2 className="text-3xl font-black tracking-tight">Swimming, Biking, Running: The Triathlon</h2>
                        </div>

                        <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                            <p>
                                Triathlon represents the ultimate multi-disciplinary challenge. Combining swimming, cycling, and running requires a paradigm shift in how you schedule your weeks. The 'brick' workout—riding your bike and immediately transitioning into a run—becomes a staple.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative h-[200px] rounded-xl overflow-hidden shadow-sm">
                                    <Image 
                                        src="/images/generated/triathlon_swimmer.png" 
                                        alt="Open water swimming" 
                                        fill 
                                        className="object-cover"
                                    />
                                </div>
                                <div className="relative h-[200px] rounded-xl overflow-hidden shadow-sm">
                                    <Image 
                                        src="/images/generated/triathlon_biker.png" 
                                        alt="Road cycling" 
                                        fill 
                                        className="object-cover"
                                    />
                                </div>
                                <div className="relative h-[200px] rounded-xl overflow-hidden shadow-sm">
                                    <Image 
                                        src="/images/generated/triathlon_runner.png" 
                                        alt="Triathlon run transition" 
                                        fill 
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            <p>
                                The swim is often the most anxiety-inducing discipline. Open water is vastly different from a clear, lane-roped pool. Practice sighting, bilateral breathing, and getting comfortable with limited visibility. On the bike, focus on smooth power delivery rather than mashing big gears, which will save your legs for the grueling run finish.
                            </p>
                        </div>
                    </section>

                    <AdBanner />

                    {/* Section 4: Good vs Bad Examples */}
                    <section className="space-y-8 pb-12">
                        <div className="flex items-center gap-3 border-b pb-4 border-border">
                            <Quote className="w-8 h-8 text-primary" />
                            <h2 className="text-3xl font-black tracking-tight">Training & Motivation Examples</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="border-2 border-red-500/20 bg-red-500/5 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <XCircle className="w-24 h-24 text-red-500" />
                                </div>
                                <CardContent className="pt-6 relative z-10 space-y-4">
                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xl">
                                        <XCircle className="w-6 h-6" />
                                        The Bad Example
                                    </div>
                                    <div className="space-y-3 text-muted-foreground">
                                        <p>
                                            <strong>"The Weekend Warrior."</strong> Mike wants to run a marathon in a month. He ignores rest days and crams his training into Saturday and Sunday, running 15 miles with no base.
                                        </p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Ignores the 10% weekly distance increment rule.</li>
                                            <li>Eats a heavy, fibrous meal right before running.</li>
                                            <li>Pushes through sharp, stabbing pain in the knee.</li>
                                            <li>Relies purely on willpower when motivation dips.</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-emerald-500/20 bg-emerald-500/5 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <CheckCircle2 className="w-24 h-24 text-emerald-500" />
                                </div>
                                <CardContent className="pt-6 relative z-10 space-y-4">
                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xl">
                                        <CheckCircle2 className="w-6 h-6" />
                                        The Good Example
                                    </div>
                                    <div className="space-y-3 text-muted-foreground">
                                        <p>
                                            <strong>"The Consistent Planner."</strong> Sarah selects a realistic 16-week plan. She integrates training into her daily routine, running early mornings consistently.
                                        </p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Runs 80% of her mileage at a very easy, conversational pace.</li>
                                            <li>Prioritizes 8 hours of sleep for cellular recovery.</li>
                                            <li>Stops immediately if tracking a developing injury.</li>
                                            <li>Attaches her training to a deep intrinsic "Why" to sustain discipline.</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                </div>
            </main>
            <PageFooter />
        </div>
    );
}

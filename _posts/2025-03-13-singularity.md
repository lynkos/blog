---
title: The Singularity
description: This paper discusses the social and global impact of the singularity and its accompanying technologies, among other things.
pin: true
date: 2025-03-13 13:29:02 -0400
math: true
categories: [ math, computer-science ]
tags: [ algorithms, artificial-intelligence, machine-learning, singularity, technology, robotics, ethics, deep-neural-networks, alignment ]
---
***Abstract** — This paper discusses the social and global impact of the singularity and its accompanying technologies, among other things.*

## Introduction
&emsp; The singularity is the hypothetical point where artificial intelligence (AI) surpasses human intelligence. Although it does not have an exact definition, it is a concept that encompasses AI, machine learning (a separate term used interchangeably with AI), computer vision, natural language processing, robotics, and more. AI itself can be thought of as “… an integrated system that incorporates information acquisition objectives, logical reasoning principles, and self-correction capacities.” [[18]](#18)

&emsp; “While AI has been hailed as the basis for a ‘fourth industrial revolution,’ it is also bringing many new challenges to the fore. AI technologies have the potential to drive economic growth in the coming years, but also to undermine democracies, aid autocrats’ pursuit of social control, and empower ‘surveillance capitalists’ who manipulate our behavior and profit from the data trails we leave online.” [[1]](#1)

## Background
&emsp; The origin and concept of the singularity can be traced back to one of the most influential and prolific multidisciplinary figures: John von Neumann, the twentieth century mathematician, computer scientist, and engineer. During the 1950s, von Neumann ominously predicted that “technological progress [would] become incomprehensively rapid and complicated” [[6]](#6) as a result of the “ever-accelerating progress of technology and changes in the mode of human life, which gives the appearance of approaching some essential singularity in the history of the race beyond which human affairs, as we know them, cannot continue.” [[7]](#7)

&emsp; Von Neumann’s musings were prescient, as the concept of a technological singularity gained traction over the following decades. Computer scientist Vernor Vinge penned The Coming Technological Singularity, an essay where he argued that humanity was “on the edge of change comparable to the rise of human life on Earth [due to] the imminent creation by technology of entities with greater than human intelligence” [[5]](#5) when it was nascent. Vinge theorized that such a breakthrough would most likely arise as a result of “the development of computers that are ‘awake’ and superhumanly intelligent; … large computer networks (and their associated users) may ‘wake up’ as a superhumanly intelligent entity; computer/human interfaces may become so intimate that users may reasonably be considered superhumanly intelligent; and biological science… [potentially finding] ways to improve upon the natural human intellect.” [[5]](#5) At the time of its writing (1993), Vinge thought “the creation of greater than human intelligence [would] occur during the next thirty years.” [[5]](#5) Thirty-two years later, the advent of large language models (LLMs) has improved AI and the field of computing by leaps and bounds.

&emsp; Even though it’s shrouded in mysticism and anthropomorphized, AI is — at its core — the output of extremely complex mathematics and systems. The term “AI” in and of itself is a broad category encompassing several different “types” of AI, each of which can be considered algorithms.

&emsp; For example, one subset of AI includes deep neural networks, which are “Inspired by biological observations on human brain mechanisms for processing of natural signals.” [[8]](#8) Deep neural networks can be defined as “… a purely mathematical object” [[9]](#9) composed of artificial neurons that are “… concatenated and arranged in layers” [[9]](#9) loosely following “… the structure and functionality of a neuron in the human brain.” [[9]](#9) “The basic elements of such a neuron are dendrites, through which signals are transmitted to its soma while being scaled/amplified due to the structural properties of the respective dendrites. In the soma of the neuron, those incoming signals are accumulated, and a decision is reached whether to fire to other neurons or not, and also with which strength.” [[9]](#9) This definition can then be mathematically defined.

&emsp; An *artificial neuron* with *weights* $w_{1}, \ldots ,w_{n} \in \mathbb{R}$, *bias* $b \in \mathbb{R}$, and *activation function* $\rho∶ \mathbb{R} \to \mathbb{R}$ is defined as the function $f∶ \mathbb{R}^{n} \to \mathbb{R}$ given by

&emsp; $f(x_{1}, \ldots, x_{n}) = \sum_{i = 1}^{n} x_{i} w_{i} - b = \rho(\langle x, w \rangle - b)$,

<style type="text/css">
    table { width: 100%; }
    tr, tbody, table { border: none !important; }
    thead { display: none !important; }
    tr { background: transparent !important; }
    td:first-child { text-align: left !important; }
    td:last-child { text-align: right !important; }
</style>

|                                                                    |           |
| :----------------------------------------------------------------: | :-------: |
| where $w = (w_{1}, \ldots, w_{n})$ and $x = x_{1}, \ldots, x_{n}$. | [[9]](#9) |

## Analysis
### Privacy
&emsp; AI tech is trained on datasets, which requires massive amounts of data. Its growing influence raises concerns about user privacy both online and offline, as this necessitates data collection that can be misused or exploited by bad actors and/or oppressive governments for surveillance, facial recognition, population monitoring, etcetera.

&emsp; One of the most recent examples is when DeepSeek, a Chinese AI startup, “… left one of its databases exposed on the internet… [allowing] full control over database operations, including the ability to access internal data [without requiring any authentication].” [[10]](#10) The vulnerability included “… more than a million lines of log streams containing chat history, secret keys, backend details, and other highly sensitive information, such as API Secrets and operational metadata.” [[10]](#10)

&emsp; Although DeepSeek is a single example, the crux of this issue and bigger picture is succinctly summarized by security researcher Gal Nagli, who expressed concern over the inherent riskiness of “[t]he rapid adoption of AI services without corresponding security… While much of the attention around AI security is focused on futuristic threats, the real dangers often come from basic risks—like the accidental external exposure of databases.” [[10]](#10) Nagli stresses the importance of protecting customer data, stating that it “… must remain the top priority for security teams, and it is crucial that security teams work closely with AI engineers to safeguard data and prevent exposure.” [[10]](#10)

### Job Displacement
&emsp; Such unprecedented developments make it difficult to foresee and anticipate its exact societal consequences. Given history’s propensity to repeat itself, conventional wisdom suggests referencing the past as a tactic/metric/method for predicting the future. The industrial revolution, most notable for being the last largescale technical paradigm shift, transformed and shifted society irreversibly as it transitioned from agrarian to mechanical.

&emsp; Despite glaringly obvious differences in circumstances, it is commonly believed that the industrial revolution’s consequences can be extrapolated and applied to the current day (albeit as a modern rendition). In other words, the singularity can be considered/seen/viewed as the industrial revolution’s contemporary equivalent since, in both cases, they result in the inevitable creation, displacement, and obsolescence of countless jobs spanning a plethora of industries. There’s also the upsides, such as improved efficiency, new opportunities and industries, and reduced costs. Yet the potential reality of mass displacement and resulting economic instability does not seem farfetched, hence the overall fear and unease towards AI that has befallen modern society overall.

&emsp; On a global scale, increased AI automation may reduce the existence of exploitative sweatshops — particularly in the global south — that are used to produce many of the goods consumed by the global north. Such sweatshops keep the prices of those goods relatively low for customers, but at the expense of the workers who are typically underpaid, overworked, and forced to labor in dangerous conditions. Limiting reliance of such sweatshops means that those workers are out of a job, thus affecting their livelihood. Ultimately, it’s a double-edged sword: Decreased exploitation and increased job displacement. A compromise would be to provide support to vulnerable workers susceptible to job displacement and workers that have already been affected by mass layoffs resulting from AI automation, including job retraining programs and financial support (such as a stipend or universal basic income).

&emsp; Another concern is the exacerbation of economic disparity between developing countries and developed countries. While developed countries have the means and resources to compete in the ‘AI arms race’ and increasingly prosper from their use of AI technologies, developing countries may struggle to catch up and risk getting left behind. Policy and investment in education may help mitigate this risk.

### Existential Risks
&emsp; The existential risks associated with a superintelligent AI system is perhaps one of the most alarming concerns around the singularity, as a worst case scenario would involve the oppression and/or annihilation of humanity at the hands of such an AI system.

&emsp; A well-known and often cited example of this is the paperclip problem, wherein “… an AI tasked with maximizing paperclip production without constraints converts all matter, including living beings, into paperclips…” [[11]](#11) Such an AI “… can arguably acquire sufficient cognitive capabilities to achieve its goal including, if necessary, the subjugation or elimination of humans,” [[13]](#13) “… subvert any control method devised by someone less intelligent than them,” [[13]](#13) and would likely prove difficult to neutralize since it “… will also act towards self-preservation,” [[13]](#13) as its continued existence is a hard requirement for achieving its goal (i.e. paperclip manufacturing). This thought experiment intends to show “… that an AI, even with benign intentions, can become ‘addicted’ to harmful behaviors if its reward model is incorrectly specified.” [[11]](#11)

&emsp; While there is still much work being done to mitigate those concerns (such as AI alignment and the accompanying strategies), it may not be enough to address all of the ethical conundrums around a superintelligent AI system and the singularity in general. For one, if a single nation-state were to develop and have sole control over such powerful tech, in the worst case it would destabilize international relations and worsen global tension, thereby also increasing the risk of conflict. It may also deepen the economic divide between countries with access to such advanced tech (typically the global north) and those without access (i.e., typically the global south).

&emsp; Avoiding such an outcome would require international cooperation, continued research on AI alignment strategies and safety measures, and the implementation of thoughtful policies.

### Bias and Fairness
&emsp; Any data an AI is trained on has the potential to be biased and introduce such biases, which may end up influencing its behavior and output. This can have widespread social impact given the ubiquity of AI algorithms.

&emsp; If “… the image datasets that are used to train today’s computer vision systems for tasks such as object recognition… were representative samples of an underlying visual world, we might expect that a computer vision system trained on one such dataset would do well on another dataset. But in reality, we observe a big drop in accuracy when we train and test on different datasets. This shows that these datasets are biased relative to each other in a statistical sense…” [[15]](#15)

&emsp; For example, a soap dispenser’s inability to detect and dispense soap to darker skinned hands suggests that the data it was trained on may have overwhelmingly consisted of images containing medium or light skin or, at the very least, did not include enough images containing dark skin. A less recent example would be how “… cameras have historically been more adept at photographing lighter-skinned individuals… [since] default settings such as color balance… were optimized for lighter skin tones… [and] the limited ‘dynamic range’ of cameras… makes it hard to capture brighter and darker tones in the same image.” [[15]](#15)

&emsp; Fairness can be quantified and defined in statistical terms, such as a decision algorithm (i.e. decision rule), which is “… any measurable function $d∶ \mathbb{R}^{\mathcal{p}} \mapsto [0, 1]$, where we interpret $d(x)$ as the probability that action $a_{1}$ is taken for an individual with visible attributes $x$.” [[14]](#14)

### Autonomy and Control
&emsp; A superintelligent agent has “… intelligence that exceeds the capabilities of the best human minds in virtually all domains.” [[11]](#11) The implications of such power necessitates alignment to “… ensure that the actions of advanced machine learning systems are directed towards the intended goals and values of humanity.” [[11]](#11) The value-loading problem, a prerequisite for safe and recursive self-improvement of superintelligent systems, seeks to determine how to “… encode human-aligned values into AI systems, and what… those values [will] be.” [[11]](#11) Research into solutions for this problem has led to the creation of a burgeoning, new field: AI alignment.

&emsp; There are several different approaches to date, including scalable oversight and weak-to-strong generalization. The former involves “… using more powerful supervisory AI models to regulate weaker AI models that may, in the future, outperform human skills” [[11]](#11) while the latter uses weaker machine learning models to “… to train stronger models that can then generalize from the weaker models’ labels.” [[11]](#11) A more recent technique known as reward modeling equips “… agents with a reward signal that guides behavior toward desired outcomes. By optimizing this signal, agents act in ways congruent with human preferences… [assuming] our emotional neurochemistry evolved as a proxy reward function for behaviors that encourage growth, adaptation, and improvement of human wellbeing simultaneously.” [[11]](#11) Perhaps one of the most notable techniques is Reinforcement Learning with Human Feedback (RLHF), which is used for state-of-the-art algorithms such as GPT-4. It combines “… reward-based reinforcement with corrective human input to improve the reward model when necessary.” [[11]](#11)

&emsp; Improper alignment, also known as misalignment, may be the outcome of “… human failings in the development of AI systems, such as people misspecifying AI rewards and/or people having biases in the labelling of AI training data” [[12]](#12) or AI autonomy, where “… things that have even low levels of intelligence can be expected to engage in adaptive behavior, and the more complex the system in which adaptive behavior takes place, the more difficult it can be to define future behaviors in advance.” [[12]](#12)

&emsp; Misalignment can be further stratified into two categories: ‘outer’ misalignment, which is “an unintended mismatch between the goal that humans give an AI and human safety or flourishing” [[17]](#17) and ‘inner’ misalignment, which pertains to  “… the complex second-order strategies—or ‘subgoals’—the AI system develops for attaining its ultimate goal.” [[17]](#17) While both have the potential to be dangerous, inner misalignment is harder to solve since “… current approaches to machine learning… are highly uninterpretable… [making it] extremely difficult to determine what subgoals a given AI has.” [[17]](#17) That is to say, subgoals emerge spontaneously and cannot be directly controlled by humans, unlike final goals.

&emsp; Misalignment is not an unusual phenomenon, and can lead to some unexpected consequences. For example, in a study where AIs were trained to play various video games, “… AIs were punished for being ‘killed’ and thus losing the game. Clearly, the human designers hoped that specifying the goal ‘avoid getting killed’ would result in the AIs learning to play the game well. But learning good gameplay is not the only way to avoid a ‘game over’ screen. Instead, the AIs invented novel attacks on the game software itself crashing the system when on the precipice of defeat. These attacks required the ‘combination of several complex actions’ and would have been ‘hard to find’ by human players.” [[17]](#17)

### Security and Safety
&emsp; Since AI can be defined as a mathematical equation or algorithm, it can be translated to code, . In fact, most modern-day AI is software created with programming languages and frameworks to simplify and streamline the creation and engineering of AI systems. As with any computer system, it is vulnerable to exploitation. This means that it can be hacked if there are vulnerabilities or bugs in its code, which a bad actor could then take advantage of.

## Examples
### China
&emsp; China is one of the most prolific adopters of AI technology. With a plethora of Chinese companies offering such tech —including Huawei, Hikvision, Dahua, and ZTE — not only does it supply its own , it supplies AI surveillance tech to a large chunk of the world; sixty-three countries, to be exact, with thirty-six of those countries having signed onto China’s Belt and Road Initiative (BRI). It is reported that “Huawei alone is responsible for providing AI surveillance technology to at least fifty countries worldwide.” [[18]](#18)

&emsp; There are three main AI surveillance techniques: smart cities (also known as safe cities), facial recognition systems, and smart policing.

&emsp; Smart cities are “cities with sensors that transmit real-time data to facilitate service delivery, city management, and public safety… they incorporate sensors, facial recognition cameras, and police body cameras connected to intelligent command centers to prevent crime, ensure public safety, and respond to emergencies.” [[18]](#18)

&emsp; Facial recognition systems are a “biometric technology that uses cameras (still images or video) to match stored or live footage of individuals with images from databases. Not all systems focus on database matching; some systems assess aggregate demographic trends or conduct broader sentiment analysis via facial recognition crowd scanning.” [[18]](#18)

&emsp; Smart policing refers to the “data-driven analytic technology used to facilitate investigations and police response; some systems incorporate algorithmic analysis to make predictions about future crimes.” [[18]](#18)

&emsp; As a major supplier of AI surveillance tech worldwide, China has a robust variety of such tools at its disposal. However, there are human rights concerns around the privacy and ethics of its use. For example, one use case is China’s social credit score system, which has been criticized for being oppressive and has also reportedly been used to surveil its citizens, particularly those of Uyghur and/or Turkic Muslim descent. The ubiquity of those tools also raises security concerns since it makes it easier for a bad actor to ‘hack’ the tech and gain access to what can be seen as a ‘treasure trove’ of data.

### The United States of America
&emsp; The government of the Unites States has been funding research on autonomous drones with the express purpose of using them for reconnaissance, surveillance, and combat operations. The reasoning behind this is straightforward: Mitigate the use of human pilots, increase efficiency, and improve the precision and success of military engagements.

&emsp; While it minimizes the amount of American casualties, the use of autonomous drones falls within a grey area and raises a number of concerns and ethical dilemmas. AI — in its current form — is an imperfect technology that can make mistakes. It’s possible that it may neutralize the wrong target, harm innocent civilians and bystanders, etc. The use of fully autonomous drones without human oversight makes it difficult to handle and enforce the repercussions of such mistakes, as an AI system cannot be held accountable. Similarly, the international laws of warfare are also not applicable to AI systems.

&emsp; Increased reliance of autonomous drones may also lead to second order effects, such as exacerbating the AI arms race, wherein “… the major powers of the world… [are] in a race for technological supremacy, with the ‘winner’ accruing major economic, political and strategic benefits.” [[19]](#19) This might worsen global tensions and lead to other unsavory consequences, such as geopolitical instability and global security concerns.

## Counterarguments
&emsp; Despite its popularity, the aforementioned ‘paperclip apocalypse’ does have its fair share of naysayers, one of which includes Joshua Gans, a professor of strategic management at the University of Toronto. Gans offers a rebuttal, believing that the AI alignment conundrum is not unique to humanity and is, instead, shared by AI as well, arguing that “… while it may be hard, or even impossible, for a human to control a super-intelligent AI, it is equally hard for a super-intelligent AI to control another AI.” [[16]](#16)

&emsp; This is based on some key assumptions, such as the jungle model, which “… endows each agent with power” [[16]](#16) wherein a more powerful entity can simply take from the less powerful without remorse. Gans finds the jungle model “… useful to understand a super-intelligent AI, because if an AI wants to appropriate resources, it needs to find a way to have power over us. If it does not have power, we can control it. If it does, it can control us.” [[16]](#16)

&emsp; But to self-improve and develop such power in the first place, the AI must “… rewrite its code to become a new AI,” [[16]](#16) which is a recursive process. Gans continues by saying, “If the AI is seeking power to protect itself from humans, doing this by creating a super-intelligent AI with more power than its parent would surely seem too risky.” [[16]](#16)

&emsp; In essence, if humanity “… were to create super-intelligence based on a regular goal, that super-intelligence would understand the control problem and its risks. Thus, it would not activate any changes that would result in power being released. We would not need to worry that it would gather power, because the AI would self-regulate to prevent that outcome.” [[16]](#16)

&emsp; Peter Salib, assistant professor of law at the University of Houston, is another skeptic. Salib’s argument is similar, predicting that any AI with the ability to self-improve would “… fear more capable systems, including if such systems result from self-improvement.” [[17]](#17) As a result, such AIs would be disincentivized against self-improvement since that would “… pose an existential threat to their unimproved originals in the same manner that smarter-than-human AIs pose an existential threat to humans.” [[17]](#17) Given this behavior, it is assumed that AI “… could collectively resist [self-improvement].” [[17]](#17) 

## Conclusion
&emsp; Even though the singularity has yet to be reached, it is self-evident that humanity is undergoing a massive paradigm shift. Increased productivity and safety coupled with mass layoffs, job displacement, increased global tensions, security concerns, and AI misalignment underscores the need for ethical considerations, thoughtful policies, and global cooperation in order to maximize the benefit and minimize the harm of such technologies.

## References
<a href="#1" name="1" id="1">[1]</a> Chat-GPT-3. (2024, July 15). “Please provide a detailed outline of the paper.” Generated using OpenAI. https://chat.openai.com

<a href="#2" name="2" id="2">[2]</a>	N. Bostrom, *Superintelligence: Paths, Dangers, Strategies*. Oxford: Oxford University Press, 2014.

<a href="#3" name="3" id="3">[3]</a>	R. Kurzweil, *The Singularity Is Near: When Humans Transcend Biology*. London: Duckworth, 2005.

<a href="#4" name="4" id="4">[4]</a>	S. Russel and P. Norvig, *Artificial Intelligence: A Modern Approach*, 4th ed. Prentice Hall, 2021.

<a href="#5" name="5" id="5">[5]</a>	V. Vinge, “The Coming Technological Singularity: How to Survive in the Post-Human Era,” *NASA Conference Publication*, pp. 11–22, Dec. 1993, Accessed: Jul. 29, 2024. [Online]. Available: https://ntrs.nasa.gov/citations/19940022856

<a href="#6" name="6" id="6">[6]</a>	J.A. Lewis, “Waiting for Skynet,” *CSIS*, Jan. 18, 2018. https://www.csis.org/analysis/waiting-skynet. Accessed 19 Feb. 2025.

<a href="#7" name="7" id="7">[7]</a>	T. Frey, “The Singularity and Our Collision Path with the Future,” *Futurist Speaker*, Apr. 17, 2014. https://futuristspeaker.com/business-trends/the-singularity-and-our-collision-path-with-the-future. Accessed 19 Feb. 2025.

<a href="#8" name="8" id="8">[8]</a>	C. Mishra and D. L. Gupta, “Deep Machine Learning and Neural Networks: An Overview,” *IAES International Journal of Artificial Intelligence (IJ-AI)*, vol. 6, no. 2, p. 66, Jun. 2017, doi: https://doi.org/10.11591/ijai.v6.i2.pp66-73.

<a href="#9" name="9" id="9">[9]</a>	G. Kutyniok, “The Mathematics of Artificial Intelligence,” *International Congress of Mathematics*, vol. 7, pp. 5118–5139, Mar. 2022, doi: https://doi.org/10.48550/arxiv.2203.08890.

<a href="#10" name="10" id="10">[10]</a> R. Lakshmanan, “DeepSeek AI Database Exposed: Over 1 Million Log Lines, Secret Keys Leaked,” *The Hacker News*, Jan. 30, 2025. https://thehackernews.com/2025/01/deepseek-ai-database-exposed-over-1.html. Accessed 19 Feb. 2025.

<a href="#11" name="11" id="11">[11]</a> Henry, Nathan I. N., et al. *A Hormetic Approach to the Value-Loading Problem: Preventing the Paperclip Apocalypse?* arXiv.org, Feb. 2024, https://doi.org/10.48550/arXiv.2402.07462. Accessed 20 Feb. 2025.

<a href="#12" name="12" id="12">[12]</a> Fox, Stephen. “Adaptive AI Alignment: Established Resources for Aligning Machine Learning with Human Intentions and Values in Changing Environments.” *Machine Learning and Knowledge Extraction*, vol. 6, no. 4, Multidisciplinary Digital Publishing Institute, Nov. 2024, pp. 2570–600, https://doi.org/10.3390/make6040124. Accessed 20 Feb. 2025.

<a href="#13" name="13" id="13">[13]</a> Gans, Joshua. *Self-Regulating Artificial General Intelligence*. Cornell University, Feb. 2018, https://doi.org/10.3386/w24352. Accessed 20 Feb. 2025.

<a href="#14" name="14" id="14">[14]</a> Corbett-Davies, Sam, et al. “Algorithmic Decision Making and the Cost of Fairness.” ArXiv, Jan. 2017, https://doi.org/10.48550/ *arXiv* .1701.08230. Accessed 20 Feb. 2025.

<a href="#15" name="15" id="15">[15]</a> Barocas, Solon, et al. *Fairness and Machine Learning: Limitations and Opportunities*. The MIT Press, 2023, fairmlbook.org/pdf/fairmlbook.pdf. Accessed 20 Feb. 2025.

<a href="#16" name="16" id="16">[16]</a> Gans, Joshua. “AI and the Paperclip Problem.” *CEPR*, Centre for Economic Policy Research, 10 June 2018, cepr.org/voxeu/columns/ai-and-paperclip-problem. Accessed 25 Feb. 2025.

<a href="#17" name="17" id="17">[17]</a> Salib, Peter. “AI Will Not Want to Self-Improve.” *Social Science Research Network*, May 2023, https://doi.org/10.2139/ssrn.4445706. Accessed 25 Feb. 2025.

<a href="#18" name="18" id="18">[18]</a> Feldstein, Steven. “The Global Expansion of AI Surveillance.” *Carnegie Endowment*, Carnegie Endowment for International Peace, 17 Sept. 2019, carnegie-production-assets.s3.amazonaws.com/static/files/files__WP-Feldstein-AISurveillance_final1.pdf. Accessed 27 Feb. 2025.

<a href="#19" name="19" id="19">[19]</a> Schmid, Stefka, et al. “Arms Race or Innovation Race? Geopolitical AI Development.” *Geopolitics*, Informa UK Limited, Jan. 2025, https://doi.org/10.1080/14650045.2025.2456019. Accessed 27 Feb. 2025.
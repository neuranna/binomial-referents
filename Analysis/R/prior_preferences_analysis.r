library(optimx)
library(tidyverse)
library(lme4)

prior <- read.csv("prior_data.csv")

# compare effect of position 
m.position_t <- glmer(CHOICE=='TOP' ~ 1 + (1|SUB) + (1|ITEM), prior, family="binomial")
summary(m.position)
m0.position_t <- glmer(CHOICE=='TOP' ~ 0 + (1|SUB) + (1|ITEM), prior, family="binomial")
anova(m0.position_t,m.position_t)

m.position_c <- glmer(CHOICE=='TOP' ~ 1 + (1|SUB) + (1|ITEM), prior, family="binomial")
summary(m.position)
m0.position_c <- glmer(CHOICE=='TOP' ~ 0 + (1|SUB) + (1|ITEM), prior, family="binomial")
anova(m0.position_c,m.position_c)

# compare effect of size
m.size_smaller <- glmer(CHOICE_SIZE=="SMALLER" ~ 1 + (1|SUB) + (1|ITEM), prior, family="binomial")
summary(m.size_smaller)
m0.size_smaller <- glmer(CHOICE_SIZE=="SMALLER" ~ 0 + (1|SUB) + (1|ITEM), prior, family="binomial")
anova(m0.size_smaller,m.size_smaller)

m.size_larger <- glmer(CHOICE_SIZE=="LARGER" ~ 1 + (1|SUB) + (1|ITEM), prior, family="binomial")
summary(m.size_larger)
m0.size_larger <- glmer(CHOICE_SIZE=="LARGER" ~ 0 + (1|SUB) + (1|ITEM), prior, family="binomial")
anova(m0.size_larger,m.size_larger)
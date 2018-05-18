library(optimx)
library(tidyverse)
library(lme4)
dat <- read.csv("binomials_data.csv")

lrs <- function(x,y) {
  if(x>y)
    return("LEFT")
  if(x<y)
    return("RIGHT")
   return("EQUAL")
}

dat$size_top <- with(dat, mapply(lrs,SIZE_A_TOP,SIZE_B_TOP))
dat$size_center <- with(dat, mapply(lrs,SIZE_A_CENTER,SIZE_B_CENTER))
dat$size_bottom <- with(dat, mapply(lrs,SIZE_A_BOTTOM,SIZE_B_BOTTOM))
dat$size_chosen <- with(dat,sapply(1:nrow(dat),function(i) switch(as.character(CHOICE[i]),
                                                       TOP=size_top[i],
                                                       CENTER=size_center[i],
                                                       BOTTOM=size_bottom[i])))
dat$size_constraint <- with(dat,mapply(function(x,y) ifelse((x==1 & y=="LEFT") | (x==2 & y=="RIGHT"),"SATISFIED",
                                                            ifelse((x==2 & y=="LEFT") | (x==1 & y=="RIGHT"),"VIOLATED",
                                                                   ifelse(y=="EQUAL","EQUAL_SIZE_CHOSEN",
                                                                          NA))),
                                       WORD_ORDER,size_chosen))
m.size <- glmer(size_constraint=="SATISFIED" ~ 1 + (1|SUB) + (1|ITEM),subset(dat,! (is.na(size_constraint) | size_constraint=="EQUAL_SIZE_CHOSEN")),family="binomial")
m0.size <- glmer(size_constraint=="SATISFIED" ~ 0 + (1|SUB) + (1|ITEM),subset(dat,! (is.na(size_constraint) | size_constraint=="EQUAL_SIZE_CHOSEN")),family="binomial")
summary(m.size)
anova(m0.size,m.size)
dat$offset_term <- logit(1/3)

m.equalsize <- glmer(size_constraint=="EQUAL_SIZE_CHOSEN" ~ offset(offset_term) + (1|SUB) + (1|ITEM), subset(dat, ! is.na(size_constraint)),family="binomial")
summary(m.equalsize)
m0.equalsize <- glmer(size_constraint=="EQUAL_SIZE_CHOSEN" ~ 0 + offset(offset_term) + (1|SUB) + (1|ITEM), subset(dat, ! is.na(size_constraint)),family="binomial")


dat$order_chosen <-with(dat,sapply(1:nrow(dat),function(i) switch(as.character(CHOICE[i]),
                                                                         TOP=ORDER_TOP[i],
                                                                         CENTER=ORDER_CENTER[i],
                                                                         BOTTOM=ORDER_BOTTOM[i])))
dat$order_constraint <- with(dat,ifelse(WORD_ORDER==0,NA,WORD_ORDER==order_chosen))
m.order <- glmer(order_constraint ~ 1 + (1|SUB) + (1|ITEM),subset(dat,!is.na(order_constraint)),family="binomial",control = glmerControl(
  optimizer ='optimx', optCtrl=list(method='L-BFGS-B')))
m0.order <- glmer(order_constraint ~ 0 + (1|SUB) + (1|ITEM),subset(dat,!is.na(order_constraint)),family="binomial",control = glmerControl(
  optimizer ='optimx', optCtrl=list(method='L-BFGS-B')))
summary(m.order)
anova(m0.order,m.order)

# removing item random effect as it had zero variance
m.a.order <- glmer(order_constraint ~ 1 + (1|SUB),subset(dat,!is.na(order_constraint)),family="binomial",control = glmerControl(
  optimizer ='optimx', optCtrl=list(method='L-BFGS-B')))
m0.a.order <- glmer(order_constraint ~ 0 + (1|SUB),subset(dat,!is.na(order_constraint)),family="binomial",control = glmerControl(
  optimizer ='optimx', optCtrl=list(method='L-BFGS-B')))
summary(m.a.order)
anova(m0.a.order,m.a.order)

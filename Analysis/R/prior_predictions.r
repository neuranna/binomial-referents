# data recoded in the "long" format, where each row corresponds to one choice option
# prior: trials where the binomial was replaced with a letter mask
prior <- read.csv("../../Data/Processed/prior_data_long.csv")

# binomial data: trials when an informative phrase was presented 
binomial_data <- read.csv("../../Data/Processed/binomial_data_long.csv")

library(mlogit)
size.as.factor <- function(dat) with(dat,ifelse(equal_size==1,"EQUAL",ifelse(left_larger,"LEFT","RIGHT")))
prior$size <- size.as.factor(prior)

dat <- mlogit.data(prior,choice="CHOICE",shape="long",chid.var="custom_id",alt.var="mode_id")
m.prior.mlogit <- mlogit(CHOICE ~ size,dat)
summary(m.prior.mlogit)

binomial_data$size <- size.as.factor(binomial_data)
dat.test <- mlogit.data(binomial_data,choice="CHOICE",shape="long",chid.var="custom_id",alt.var="mode_id")
predictions <- predict(m.prior.mlogit,dat.test)
write.csv(predictions,"../../Data/Processed/predictions-mlogit.csv")
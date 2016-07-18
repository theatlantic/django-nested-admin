from django.db import models


class Main(models.Model):

    text = models.CharField(max_length=255, blank=True, null=True)


class Level1(models.Model):

    main = models.ForeignKey(Main, on_delete=models.CASCADE)


class Level2(models.Model):

    level_1 = models.ForeignKey(Level1, on_delete=models.CASCADE)
    text = models.CharField(max_length=255, blank=True, null=True)

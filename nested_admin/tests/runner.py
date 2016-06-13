import unittest
import django.test.runner


class TextTestResult(unittest.TextTestResult):
    """Overridden test result class that doesn't failfast on unexpected success"""

    def addUnexpectedSuccess(self, test):
        self.unexpectedSuccesses.append(test)
        if self.showAll:
            self.stream.writeln("unexpected success")
        elif self.dots:
            self.stream.write("u")
            self.stream.flush()

    def printErrors(self):
        super(TextTestResult, self).printErrors()
        self.printErrorList('UNEXPECTED SUCCESS',
            [(t, 'Success') for t in self.unexpectedSuccesses])


class DiscoverRunner(django.test.runner.DiscoverRunner):
    """Overridden DiscoverRunner that doesn't failfast on unexpected success"""

    def get_resultclass(self):
        return TextTestResult

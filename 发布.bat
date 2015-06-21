@pushd %~dp0

::@call grunt clean
::@call grunt compass
::@call grunt concat
@call grunt

@echo ok
@pause
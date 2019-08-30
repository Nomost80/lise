{{/* vim: set filetype=mustache: */}}
{{- define "kafka.endpoint" -}}
{{- $name := include "kafka.name" . -}}
{{- $port := default 9092 .Values.kafka.service.port | toString -}}
{{- printf "%s-%s.%s.%s:%s".Release.Name $name .Release.Namespace "svc.cluster.local" $port -}}
{{- end -}}
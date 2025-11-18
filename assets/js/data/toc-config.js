---
layout: compress
---

{% comment %}
Generate heading selector string for table of contents.
{% endcomment %}

{% assign heading_levels = "" %}
{% for i in (site.toc.min_heading_level..site.toc.max_heading_level) %}
  {% if forloop.first %}
    {% assign heading_levels = "h" | append: i %}
  {% else %}
    {% assign heading_levels = heading_levels | append: ", h" | append: i %}
  {% endif %}
{% endfor %}

export const heading = '{{ heading_levels }}';
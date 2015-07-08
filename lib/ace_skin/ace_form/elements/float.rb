module AceSkin
  module AceForm
    module Elements
      class Float < Integer

        def ext_html
          {'data-toggle' => 'float', 'type' => 'text', 'class' => real_class,
           'data-min' => options[:min].try(:to_f), 'data-max' => options[:max].try(:to_f)}
        end
      end
    end
  end
end

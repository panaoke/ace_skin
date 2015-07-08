module AceSkin
  module AceForm
    module Elements
      class Audio < Base

        def ext_html
          {'data-toggle' => 'audio', class: 'ace-input'}
        end

        def output
          (value || []).map do |val|
            r1 = content_tag(:div,  class: :form_audio_div) do
              val.map do |k,v|
                content_tag(:input, name: "#{dom_name}[][#{k}]", value: v, type: :hidden) do

                end
              end.join(' ').html_safe
            end

            r2 = content_tag(:div, class: :form_audio) do
              content_tag(:audio,
                          {
                           preload: :auto,
                           'data-options' =>  val,
                           controls: true,
                           src: ContentAgent::Content.accessible_url(val['content_id'])}) do

              end
            end
            r1 << r2
            r1
          end.join(' ').html_safe
        end
      end
    end
  end
end
